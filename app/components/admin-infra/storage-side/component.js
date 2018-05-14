import Ember from 'ember';
export default Ember.Component.extend({

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
    return this.get('model.created_at');
  }.property('model.created_at'),

  disks: function() {
    return this.get('model.storage_info.disks');
  }.property('model.storage_info.disks'),

  diskName: function() {
    return this.get('disks.disk');
  }.property('disks.disk'),

  count: function() {
    return this.get('pools').length < 0 ? true : false;
  }.property('model.storage_info.disks'),

});
