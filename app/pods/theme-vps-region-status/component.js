import Ember from 'ember';
import C from 'nilavu/utils/constants';

export default Ember.Component.extend({
  tagName: '',

  statusNotOkay: function() {
    return !this.get('model.status.phase') === C.PHASE.READY;
  }.property('model'),

  country: function() {
    return this.get('model.object_meta.name');
  }.property('model'),

});
