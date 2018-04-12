import Ember from 'ember';
import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Service.extend(DefaultHeaders, {
  userStore: Ember.inject.service('store'),

  delete: function(assemblyId, data) {
    var session = this.get('session');
    //TODO: why delete this metrics value
    //delete data.spec.metrics.counter;
    return this.get('userStore').rawRequest(this.rawRequestOpts({
      url: '/api/v1/assemblys/' + assemblyId,
      method: 'PUT',
      data: data,
    })).then((xhr) => {
      return xhr;
    }).catch((res) => {
      let err;
      try {
        err = res.body;
      } catch (e) {
        err = {
          type: 'error',
          message: 'Error logging in'
        };
      }
      return Ember.RSVP.reject(err);
    });
  },

});
