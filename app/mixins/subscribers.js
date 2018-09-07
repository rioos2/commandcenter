import Ember from 'ember';
import Socket from 'nilavu/utils/socket';
import C from 'nilavu/utils/constants';
import Subscriber from 'nilavu/utils/subscribe';
import config from '../config/environment';

const { get } = Ember;

export default Ember.Mixin.create({

  subscribers: null,


  init() {
    this._super();
    var websocketHost = window.location.host;
    if(config.APP.desktop) {
      websocketHost = config.APP.proxyHost + ":" + config.APP.proxyPort;
    }
    const accountSubscriber  = Ember.Object.create({ url: "ws://" + websocketHost + this.get('app.wsEndpoint')+"accounts/"+this.get('session').get("id")+"/watch", subscriber: Subscriber.create()});
    const healthzSubscriber  = Ember.Object.create({ url: "ws://" + websocketHost + this.get('app.wsEndpoint')+"healthz/overall", subscriber: Subscriber.create()});
    this.set('subscribers', [accountSubscriber, healthzSubscriber]);
  },

  connectSubscribers() {
  this.get('subscribers').forEach((s) => s.subscriber.connectSubscribe(s.url))
  },

  disconnectSubscribers(cb) {
     this.get('subscribers').forEach((s) => s.subscriber.disconnectSubscribe())
  },

});
