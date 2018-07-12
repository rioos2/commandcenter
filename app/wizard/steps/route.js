import Ember from 'ember';

export default Ember.Route.extend({
  access: Ember.inject.service(),

  beforeModel: function() {
    this.get('access').activate().then((config) => {
      if (config) {
          this.transitionTo('authenticated');
      }
    });
    this.transitionTo('wizard.steps.step', '1');
  }

});
