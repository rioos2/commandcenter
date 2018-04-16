import Ember from 'ember';

export default Ember.Route.extend({

  model(params) {
    return {
      host: params.vnchost,
      port: params.vncport,
      id: params.id
    }
  },
});
