import Route from '@ember/routing/route';
export default Route.extend({

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
