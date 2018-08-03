import Ember from 'ember';

export default Ember.Route.extend({
  access:   Ember.inject.service(),
  language: Ember.inject.service('user-language'),

  // Has rioos is activated or not. If not activated first step page
  beforeModel(transition) {
    this._super.apply(this, arguments);

    return this.get('language').initUnauthed().then(() => {
      if (this.get('access').isLoggedIn()) {
        this.transitionTo('authenticated');
      }
      this.get('access').activate().then((config) => {
        if (!config) {
          this.transitionTo('wizard');
        }
      }).catch((err) => {
        return Ember.RSVP.reject(err);
      });
    });
  },
});
