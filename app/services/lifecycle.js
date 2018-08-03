import DefaultHeaders from 'nilavu/mixins/default-headers';
import Service from '@ember/service';

export default Service.extend(DefaultHeaders, {
  userStore: Ember.inject.service('store'),

  delete(assemblyId, data) {
    var session = this.get('session');

    // Here metrics.counter value changes by component as integer but api only accept that field as string.
    delete data.spec;

    return this.get('userStore').rawRequest(this.rawRequestOpts({
      url:    `/api/v1/assemblys/${  assemblyId }`,
      method: 'PUT',
      data,
    })).then((xhr) => {
      return xhr;
    }).catch((res) => {
      let err;

      try {
        err = res.body;
      } catch (e) {
        err = {
          type:    'error',
          message: 'Error logging in'
        };
      }

      return Ember.RSVP.reject(err);
    });
  },

});
