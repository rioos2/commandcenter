import Ember from 'ember';
export default Ember.Component.extend({

name: function(){
  return this.get('pool.object_meta.name');
}.property('pool.object_meta.name'),

status: function() {
  return this.get('pool.status.phase');
}.property('pool.status.phase'),

diskCount: function(){
  return this.get('pool.storage_info.disks.length');
}.property('pool.storage_info.disks'),

disks: function(){
  return this.get('pool.storage_info.disks');
}.property('pool.storage_info.disks'),

});
