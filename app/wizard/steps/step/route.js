import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    $('BODY').addClass('wizard-page');
  },
  
  model: function(params) {
    console.log(JSON.stringify(params));
    return params;
  },
  setupController(controller, model) {
    controller.set('selectedStep', model.step);
    this._super(...arguments);
  }
});
