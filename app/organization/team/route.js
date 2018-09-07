import Route from '@ember/routing/route';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import { hash } from 'rsvp';

export default Route.extend(DefaultHeaders, {
  currentOrigin: null,
  model(params) {
    this.set('currentOrigin', params.org);

    return hash({ team: this.get('store').find('member', null, this.opts(`teams/${ params.teamid }`, true)), });
  },

  setupController(controller) {
    controller.set('currentOrigin', this.get('currentOrigin'));
    this._super(...arguments);
  },

});
