import Ember from 'ember';

export default Ember.Route.extend({

  model(params) {
    return {
      host:  params.vnchost,
      accid: params.account_id,
      id:    params.id
    }
  },
});
