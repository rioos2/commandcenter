import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import { hash } from 'rsvp';

export default Route.extend(DefaultHeaders, {

  guardian:    service(),

  beforeModel() {
    if (!this.get('guardian').transByAccountState()) {
      this.transitionTo('authenticated');
    }
  },

  model() {

    return hash({ invitation: this.get('store').find('invitation', null, this.opts(`invitations/${ this.get('session.email') }`, true)), });
  },

});
