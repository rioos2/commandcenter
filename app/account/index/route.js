import DefaultHeaders from 'nilavu/mixins/default-headers';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend(DefaultHeaders, {

  access:    service(),
  userStore: service('user-store'),
  session:   service(),

  model() {
    return hash({
      profile:  this.get('store').find('account', null, this.opts(`accounts/${  this.get('session').get('id') }`)),
      sessions: this.get('store').find('session', null, this.opts('sessions')),
      // events:   this.get('store').find('event', null, this.opts('events')),
    });
  },

  afterModel(model) {
    if (!(model.profile.content === undefined)) {
      model.profile = model.profile.content[0];
    }

    return model;
  },

});
