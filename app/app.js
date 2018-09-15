import Application from  '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import Ember from 'ember';

let App;

App = Application.extend({
  modulePrefix:    config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

// Trap the uncaught global errors to slack.
// For now we print it on the console.
// TO-DO Need to send error to slack channel
Ember.onerror = function(error) {
  /* Ti-DO: Fix it up for prod.
   * reportErrorToService(error);
   **/

  console.log('(✖╭╮✖)  ****         Uncaught Exception             ****');
  console.log(`          ,--.!,
       __/   -*-
     ,d08b.  '|'
     0088MM
     '9MMP'   `);
  console.error(error);
  // Throw the errors back, if you are testing.
  if (Ember.testing) {
    throw error;
  }
}

loadInitializers(App, config.modulePrefix);

export default App;
