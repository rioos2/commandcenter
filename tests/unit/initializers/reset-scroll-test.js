import Ember from 'ember';
import ResetScrollInitializer from 'ember-vitality/initializers/reset-scroll';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | reset scroll', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  ResetScrollInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
