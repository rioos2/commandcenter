import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default Route.extend({
  access: service(),
  beforeModel(/* transition*/) {
    this.get('access').activate().then((config) => {
      if (!config) {
        this.transitionTo('wizard');
      }
    }).catch((err) => {
      return reject(err);
    });
  },

});
