import Ember from 'ember';

export default Ember.Route.extend({
  storeReset: Ember.inject.service(),

  model() {
    return this.controllerFor('application').get('error');
  },

  afterModel(model) {
    if ( model ) {
      this.get('storeReset').reset();
    } else {
      this.transitionTo('authenticated');
    }
  },
  actions: {
    activate() {
      $('BODY').addClass('farm');
    },

    deactivate() {
      $('BODY').removeClass('farm');
    },
  },

});
