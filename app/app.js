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
Ember.onerror = function(error) {
  console.error(error);
}

loadInitializers(App, config.modulePrefix);

export default App;
