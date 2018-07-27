import Ember from 'ember';
import C from 'nilavu/utils/constants';

export default Ember.Route.extend({
  access: Ember.inject.service(),

  loadingError(err, transition, ret) {
    if (err && err.status && [C.UNAUTHENTICATED_HTTP_CODES, C.UNAUTHORIZED_HTTP_CODES].indexOf(err.status) >= 0) {
      this.send('logout', transition, true);
      return;
    }

    this.transitionTo('authenticated');

    return ret;
  },
});
