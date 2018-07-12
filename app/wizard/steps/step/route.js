import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    $('BODY').addClass('wizard-page');
  },

  model: function(params) {
    return params;
  },

  setupController(controller, model) {
    controller.set('selectedStep', model.id);
    this._super(...arguments);
  }
});
