import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default Route.extend({
  access: service(),

  loadingError(err, transition, ret) {
    if (err && err.status && [401, 403].indexOf(err.status) >= 0) {
      this.send('logout', transition, true);

      return;
    }

    this.transitionTo('authenticated');

    return ret;
  },
});
