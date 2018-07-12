import Ember from 'ember';

export default Ember.Route.extend({
  access: Ember.inject.service(),
  language: Ember.inject.service('user-language'),

  beforeModel(transition) {
    this._super.apply(this,arguments);
    return this.get('language').initUnauthed().then(() => {
      if (this.get('access').isLoggedIn())
      {
        this.transitionTo('authenticated');
      }
      this.get('access').wizardPageRedirect().then((config) => {
        if (!config) {
            this.transitionTo('wizard');
        }
      }).catch((err) => {
        return Ember.RSVP.reject(err);
      });
    });
  },
});
