import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { reject } from 'rsvp';
export default Route.extend({
  access:   service(),
  language: service('user-language'),

  // Has rioos is activated or not. If not activated first step page
  beforeModel(/* transition*/) {
    this._super.apply(this, arguments);

    return this.get('language').initUnauthed().then(() => {
      if (this.get('access').isLoggedIn()) {
        this.transitionTo('authenticated');
      }
      this.get('access').activate().then((config) => {
        if (!config) {
          this.transitionTo('wizard');
        }
      }).catch((err) => {
        return reject(err);
      });
    });
  },
});
