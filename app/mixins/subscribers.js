import Ember from 'ember';
import Socket from 'nilavu/utils/socket';
import C from 'nilavu/utils/constants';
import Subscriber from 'nilavu/utils/subscribe';

const { get } = Ember;

export default Ember.Mixin.create({

  subscribers: null,


  init() {
    this._super();
    const accountSubscriber  = Ember.Object.create({ url: "ws://" + window.location.host + this.get('app.wsEndpoint')+"accounts/"+this.get('session').get("id")+"/watch", subscriber: Subscriber.create()});
    const healthzSubscriber  = Ember.Object.create({ url: "ws://" + window.location.host + this.get('app.wsEndpoint')+"healthz/overall", subscriber: Subscriber.create()});
    this.set('subscribers', [accountSubscriber, healthzSubscriber]);
  },

  connectSubscribers() {
  this.get('subscribers').forEach((s) => s.subscriber.connectSubscribe(s.url))
  },

  disconnectSubscribers(cb) {
     this.get('subscribers').forEach((s) => s.subscriber.disconnectSubscribe())
  },

});
