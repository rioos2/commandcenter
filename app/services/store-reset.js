import config from './../config/environment';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
export default Service.extend({
  store:     service(),
  userStore: service('user-store'),
  // webhookStore: Ember.inject.service('webhook-store'),
  // catalog: Ember.inject.service(),

  reset() {
    // Forget all the things
    this.get('userStore').reset();
    this.get('store').reset();
    // this.get('catalog').reset();
    // this.get('webhookStore').reset();
  },

  // Load application is desktop or web
  // If it is desktop application, then add the proxy server url
  // otherwise ember manage it.
  set() {
    var host = `http://${  config.APP.proxyHost }`;

    this.get('userStore').setApplication(config.APP.desktop, host, config.APP.proxyPort);
    this.get('store').setApplication(config.APP.desktop, host, config.APP.proxyPort);
  },
});
