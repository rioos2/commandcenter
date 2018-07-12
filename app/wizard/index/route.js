import Ember from 'ember';

export default Ember.Route.extend({
  access: Ember.inject.service(),

  beforeModel: function() {

    $('BODY').addClass('wizard-page');

    this.get('access').activate().then((config) => {
      if (config) {
          this.transitionTo('authenticated');
      }
    });

    this.transitionTo('wizard.steps');
  }

});
