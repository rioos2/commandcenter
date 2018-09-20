import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';


export default Route.extend({

  guardian:    service(),

  beforeModel() {
    if (!this.get('guardian').transByAccountState()) {
      this.transitionTo('authenticated');
    }
  }

});
