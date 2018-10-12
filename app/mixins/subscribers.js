import Subscriber from 'nilavu/utils/subscribe';
import config from '../config/environment';
import Mixin from '@ember/object/mixin';
import EmberObject from '@ember/object';


export default Mixin.create({

  subscribers: null,


  init() {
    this._super();
    var websocketHost = window.location.host;

    if (config.APP.desktop) {
      websocketHost = `${ config.APP.proxyHost  }:${  config.APP.proxyPort }`;
    }
    const accountSubscriber  = EmberObject.create({
      url:        `ws://${  websocketHost  }${ this.get('app.wsEndpoint')  }accounts/${  this.get('session').get('id')  }/watch`,
      subscriber: Subscriber.create()
    });
    const healthzSubscriber  = EmberObject.create({
      url:        `ws://${  websocketHost  }${ this.get('app.wsEndpoint')  }healthz/overall/watch`,
      subscriber: Subscriber.create()
    });

    this.set('subscribers', [accountSubscriber, healthzSubscriber]);
  },

  connectSubscribers() {
    this.get('subscribers').forEach((s) => s.subscriber.connectSubscribe(s.url))
  },

  disconnectSubscribers() {
    this.get('subscribers').forEach((s) => s.subscriber.disconnectSubscribe())
  },

});
