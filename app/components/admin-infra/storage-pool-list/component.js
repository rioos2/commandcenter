import Component from '@ember/component';
import { isEmpty } from '@ember/utils';

export default Component.extend({

  name: function() {
    return this.get('pool.object_meta.name');
  }.property('pool.object_meta.name'),

  status: function() {
    return isEmpty(this.get('pool.status.phase')) ? '' : this.get('pool.status.phase').capitalize();
  }.property('pool.status.phase'),

  diskSize: function() {
    return this.get('pool.storage_info.disks.length');
  }.property('pool.storage_info.disks'),

  disks: function() {
    return this.get('pool.storage_info.disks');
  }.property('pool.storage_info.disks'),

});
