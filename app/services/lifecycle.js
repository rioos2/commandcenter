import Ember from 'ember';
import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Service.extend(DefaultHeaders, {
  userStore: Ember.inject.service('store'),

  delete: function(assemblyId, data) {
    var session = this.get('session');
    //Here metrics.counter value changes by component as integer but api only accept that field as string.
    if(data.spec.metrics) {
      delete data.spec.metrics;
    }
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
