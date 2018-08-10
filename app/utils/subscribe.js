import C from 'nilavu/utils/constants';
import Socket from 'nilavu/utils/socket';
import { get } from '@ember/object';
import EmberObject from '@ember/object';
import { schedule } from '@ember/runloop';

export default EmberObject.extend({

  subscribeSocket: null,
  reconnect:       true,
  connected:       false,
  reportsUrl:      false,
  url:             null,

  init() {
    this._super();

    var store = Nilavu.__container__.lookup('service:store'); // eslint-disable-line
    // this.container.lookup('thing:main');

    var socket = Socket.create();

    socket.on('message', (event) => {
      schedule('actions', this, function() {
        // Fail-safe: make sure the message is for this project
        var currentProject = this.get(`tab-session.${ C.TABSESSION.PROJECT }`);
        var metadata = socket.getMetadata();
        var socketProject = metadata.projectId;

        if (currentProject !== socketProject) {
          console.error(`Subscribe ignoring message, current=${ currentProject } socket=${ socketProject } ${  this.forStr() }`);
          this.connectSubscribe(this.get('url'));

          return;
        }

        var d = JSON.parse(event.data);
        let resource;

        if (d) {
          resource = d.data ? store._typeify(d.data) : store._typeify(d);
          d.data = resource;
        }

        // this._trySend('subscribeMessage',d);

        if (d.name === 'resource.change') {
          let key = `${ d.resourceType  }Changed`;

          if (this[key]) {
            this[key](d);
          }

          if (resource && C.MANAGEMENT.STATUS.TERMINATE.includes(resource.state)) {
            let type = get(resource, 'type');
            let baseType = get(resource, 'baseType');

            store._remove(type, resource);

            if (baseType && type !== baseType) {
              store._remove(baseType, resource);
            }
          }
        } else if (d.name === 'ping') {
          this.subscribePing(d);
        }
      });
    });

    socket.on('connected', (tries, after) => {
      this.subscribeConnected(tries, after);
    });

    socket.on('disconnected', () => {
      this.subscribeDisconnected(this.get('tries'));
    });

    this.set('subscribeSocket', socket);
  },

  connectSubscribe(url = '') {
    var socket = this.get('subscribeSocket');
    var projectId = this.get(`tab-session.${ C.TABSESSION.PROJECT }`);

    this.set('reconnect', true);
    this.set('url', url);

    socket.setProperties({
      url,
      autoReconnect: true,
    });
    socket.reconnect({ projectId });
  },

  disconnectSubscribe(cb) {
    this.set('reconnect', false);
    var socket = this.get('subscribeSocket');

    if (socket && socket._state !== 'disconnected') {
      console.log(`Subscribe disconnect ${  this.forStr() }`);
      socket.disconnect(cb);
    } else if (cb) {
      cb();
    }
  },


  forStr() {
    let out = '';
    let socket = this.get('subscribeSocket');
    var projectId = this.get(`tab-session.${ C.TABSESSION.PROJECT }`);

    if (socket) {
      out = `(projectId=${  projectId  }, sockId=${  socket.getId()  })`;
    }

    return out;
  },

  // WebSocket connected
  subscribeConnected(tries, msec) {
    this.set('connected', true);

    let msg = `Subscribe connected ${  this.forStr() }`;

    if (tries > 0) {
      msg += ` (after ${  tries  } ${  tries === 1 ? 'try' : 'tries' }`;
      if (msec) {
        msg += `, ${  msec / 1000  } sec`;
      }

      msg += ')';
    }

    console.log(msg);
  },

  // WebSocket disconnected (unexpectedly)
  subscribeDisconnected() {
    this.set('connected', false);

    console.log(`Subscribe disconnected ${  this.forStr() }`);
    if (this.get('reconnect')) {
      this.connectSubscribe(this.get('url'));
    }
  },

  subscribePing() {
    console.log(`Subscribe ping ${  this.forStr() }`);
  },

});
