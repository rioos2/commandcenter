import Route from '@ember/routing/route';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import { hash } from 'rsvp';

export default Route.extend(DefaultHeaders, {
  currentOrigin: null,
  model(params) {
    return hash({ team: this.get('store').find('member', null, this.opts(`teams/${ params.teamid }`, true)), });
  },
});
