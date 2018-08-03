import Ember from 'ember';
import C from 'nilavu/utils/constants';
export default Ember.Component.extend({
  intl: Ember.inject.service(),

  name: function() {
    return this.get('model.object_meta.name');
  }.property('model'),

  ip: function() {
    return this.get('model.node_ip');
  }.property('model.node_ip'),

  status: function() {
    return Ember.isEmpty(this.get('model.status.phase')) ? '' : this.get('model.status.phase').capitalize();
  }.property('model.status.phase'),

  emptyError: function() {
    return this.get('intl').t(`stackPage.admin.${  this.get('type')  }.noNode`);
  }.property('type'),

  bridges: function() {
    return Ember.isEmpty(this.get('model.status.node_info.bridges')) ? '' : this.get('model.status.node_info.bridges') ;
  }.property('model.status.node_info.bridges'),

  nodeAvailable: function() {
    return !(Ember.isEmpty(this.get('status')) && Ember.isEmpty(this.get('name')) && Ember.isEmpty(this.get('ip')) );
  }.property('status', 'name', 'ip'),


});
