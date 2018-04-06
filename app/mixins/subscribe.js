import Ember from 'ember';
import Socket from 'nilavu/utils/socket';
import C from 'nilavu/utils/constants';

const { get } = Ember;

export default Ember.Mixin.create({
  'tab-session': Ember.inject.service(),
  session: Ember.inject.service(),

  subscribeSocket: null,
  reconnect: true,
  connected: false,

  init() {
    this._super();

    var store = this.get('store');

    var socket = Socket.create();

    socket.on('message', (event) => {
      Ember.run.schedule('actions', this, function() {
        // Fail-safe: make sure the message is for this project
        var currentProject = this.get(`tab-session.${C.TABSESSION.PROJECT}`);
        var metadata = socket.getMetadata();
        var socketProject = metadata.projectId;
        if (currentProject !== socketProject) {
          console.error(`Subscribe ignoring message, current=${currentProject} socket=${socketProject} ` + this.forStr());
          this.connectSubscribe();
          return;
        }

        var d = JSON.parse(event.data);
        let resource;
        if (d.data) {
          resource = store._typeify(d.data);
          d.data = resource;
        }

        //this._trySend('subscribeMessage',d);

        if (d.name === 'resource.change') {
          let key = d.resourceType + 'Changed';
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

  connectSubscribe() {
    var socket = this.get('subscribeSocket');
    var projectId = this.get(`tab-session.${C.TABSESSION.PROJECT}`);
    var url = ("ws://" + window.location.host + this.get('app.wsEndpoint')+"account/"+this.get('session').get("id")+"/watch");

    this.set('reconnect', true);

    socket.setProperties({
      url: url,
      autoReconnect: true,
    });
    socket.reconnect({ projectId: projectId });
  },

  disconnectSubscribe(cb) {
    this.set('reconnect', false);
    var socket = this.get('subscribeSocket');
    if (socket && socket._state !== 'disconnected') {
      console.log('Subscribe disconnect ' + this.forStr());
      socket.disconnect(cb);
    } else if (cb) {
      cb();
    }
  },


  forStr() {
    let out = '';
    let socket = this.get('subscribeSocket');
    var projectId = this.get(`tab-session.${C.TABSESSION.PROJECT}`);
    if (socket) {
      out = '(projectId=' + projectId + ', sockId=' + socket.getId() + ')';
    }

    return out;
  },

  // WebSocket connected
  subscribeConnected: function(tries, msec) {
    this.set('connected', true);

    let msg = 'Subscribe connected ' + this.forStr();
    if (tries > 0) {
      msg += ' (after ' + tries + ' ' + (tries === 1 ? 'try' : 'tries');
      if (msec) {
        msg += ', ' + (msec / 1000) + ' sec';
      }

      msg += ')';
    }

    console.log(msg);
  },

  // WebSocket disconnected (unexpectedly)
  subscribeDisconnected: function() {
    this.set('connected', false);

    console.log('Subscribe disconnected ' + this.forStr());
    if (this.get('reconnect')) {
      this.connectSubscribe();
    }
  },

  subscribePing: function() {
    console.log('Subscribe ping ' + this.forStr());
  },

});
