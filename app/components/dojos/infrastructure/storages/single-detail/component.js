import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import $ from 'jquery';

export default Component.extend({
  tagName: '',

  ariaEexpanded_pool: true,
  ariaEexpanded_disk: true,

  pools: alias('storagespool'),
  name:  function() {
    return this.get('model.object_meta.name');
  }.property('model.object_meta.name'),

  ip: function() {
    return this.get('model.host_ip');
  }.property('model.host_ip'),

  type: function() {
    return this.get('model.storage_type');
  }.property('model.storage_type'),

  status: function() {
    return isEmpty(this.get('model.status.phase')) ? '' : this.get('model.status.phase').capitalize();
  }.property('model.status.phase'),

  storageAvailable: function() {
    return !(isEmpty(this.get('status')) && isEmpty(this.get('name')) && isEmpty(this.get('ip')) && isEmpty(this.get('type')));
  }.property('status', 'name', 'type', 'ip'),

  diskSize: function() {
    return this.get('disks.length') < 0;
  }.property('disks'),

  createdAt: function() {
    return isEmpty(this.get('model.created_at')) ? '' : this.get('model.created_at').split('T')[0];
  }.property('model.created_at'),

  disks: function() {
    return this.get('model.storage_info.disks');
  }.property('model.storage_info.disks'),

  count: function() {
    return this.get('pools.length') > 0 ? false : true;
  }.property('storagespool'),


  didInsertElement() {
    this.send('collapse_pool');
    this.send('collapse_disk');
  },

  actions: {

    collapse_pool() {
      if (this.get('ariaEexpanded_pool')) {
        this.set('ariaEexpanded_pool', false);
        this.set('collapsed_pool', 'collapsed');
        this.set('style_pool', 'height: 0px;');
        this.set('enabler_pool', 'collapse');
      } else {
        this.set('ariaEexpanded_pool', true);
        this.set('collapsed_pool', '');
        this.set('style_pool', '');
        this.set('enabler_pool', 'collapse in');
      }
    },

    collapse_disk() {
      if (this.get('ariaEexpanded_disk')) {
        this.set('ariaEexpanded_disk', false);
        this.set('collapsed_disk', 'collapsed');
        this.set('style_disk', 'height: 0px;');
        this.set('enabler_disk', 'collapse');
      } else {
        this.set('ariaEexpanded_disk', true);
        this.set('collapsed_disk', '');
        this.set('style_disk', '');
        this.set('enabler_disk', 'collapse in');
      }
    },

    openModal() {
      $('#pooladd').modal('show');
    },
    openEditModal(){
      $('#storage_edit').modal('show');
    },

    doReloaded() {
      this.sendAction('doStorageReload');
    }

  }

});