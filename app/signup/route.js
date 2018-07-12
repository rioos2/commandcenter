import Ember from 'ember';

export default Ember.Route.extend({
  access: Ember.inject.service(),
  beforeModel(transition) {
    this.get('access').activate().then((config) => {
      if (!config) {
          this.transitionTo('wizard');
      }
    }).catch((err) => {
      return Ember.RSVP.reject(err);
    });
  },

});
