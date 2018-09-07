import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  storeReset: service(),

  model() {
    return this.controllerFor('application').get('error');
  },

  afterModel(model) {
    if ( model ) {
      this.get('storeReset').reset();
    } else {
      this.transitionTo('authenticated');
    }
  },

});
