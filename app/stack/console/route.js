import Ember from 'ember';

  export default Ember.Route.extend({

  model(params) {
    return {
      host: params.vnchost,
      port: params.vncport
    }
  },

  setupController(controller, model) {
    this._super(...arguments);
    controller.set('model', model);
  }

});
