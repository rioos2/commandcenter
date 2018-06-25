import Ember from 'ember';
import config from './../config/environment';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  userStore: Ember.inject.service('user-store'),
  //webhookStore: Ember.inject.service('webhook-store'),
  //catalog: Ember.inject.service(),
  
  reset: function() {
    // Forget all the things
    console.log('Store Reset');    
    this.get('userStore').reset();
    this.get('store').reset();
    //this.get('catalog').reset();
    //this.get('webhookStore').reset();
  },

  // Load application is desktop or web
  // If it is desktop application, then add the proxy server url
  // otherwise ember manage it.
  set: function() {    
    this.get('userStore').setApplication(config.APP.desktop, config.APP.proxyHost, config.APP.proxyPort);
    this.get('store').setApplication(config.APP.desktop, config.APP.proxyHost, config.APP.proxyPort);
  },
});
