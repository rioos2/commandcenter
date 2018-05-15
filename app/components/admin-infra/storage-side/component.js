import Ember from 'ember';
export default Ember.Component.extend({
  tagName: "",

pools:  Ember.computed.alias('storagespool'),

  name: function() {
    return this.get('model.object_meta.name');
  }.property('model.object_meta.name'),

  ip: function() {
    return this.get('model.host_ip');
  }.property('model.host_ip'),

  type: function() {
    return this.get('model.storage_type');
  }.property('model.storage_type'),

  status: function() {
    return this.get('model.status.phase');
  }.property('model.status.phase'),

  created: function() {
    return Ember.isEmpty(this.get('model.created_at'))? "": this.get('model.created_at').split('T')[0];
  }.property('model.created_at'),

  disks: function() {
    return this.get('model.storage_info.disks');
  }.property('model.storage_info.disks'),

  count: function() {
    return this.get('pools.length') > 0 ? false : true;
  }.property('storagespool'),

});
