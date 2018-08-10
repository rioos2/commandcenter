import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import C from 'nilavu/utils/constants';

export default Route.extend({
  access: service(),

  loadingError(err, transition, ret) {
    if (err && err.status && C.UNAUTHENTICATED_UNAUTHORIZED_HTTP_CODES.indexOf(err.status) >= 0) {
      this.send('logout', transition, true);

      return;
    }

    this.transitionTo('authenticated');

    return ret;
  },
});
