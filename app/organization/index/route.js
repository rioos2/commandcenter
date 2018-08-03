import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Route.extend(DefaultHeaders, {
  model(params) {
    return Ember.RSVP.hash({
      origin:        this.get('store').find('origin',null, this.opts('origins/'+ params.org)),
    });
  },
});
