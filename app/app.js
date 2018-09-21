import Application from  '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import Ember from 'ember';
import * as Sentry from '@sentry/browser'

let App;

App = Application.extend({
  modulePrefix:    config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

// Trap the uncaught global errors.
// We print it on the console and send it
// to sentry. Sentry's option to captureGlobal errors, is enabled.
// This function gets called after sending the error to sentry.
Ember.onerror = function(error) {
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
};

// Used by engineering to monitor errros in the Rio/OS system.
Sentry.init({
  dsn:          config.sentry.dsn,
  release:      config.APP.version,
  environment:  config.environment,
  repos:        config.APP.repository,
  sampleRate:   0.5, // If the sample rate is 1.0, then 100% events are sent.
  debug:        config.sentry.debug,
  integrations: [new Sentry.Integrations.Ember()]
});

loadInitializers(App, config.modulePrefix);

export default App;
