import Ember from 'ember';
export default Ember.Component.extend({
  tagName: "",

  pools:  Ember.computed.alias('storagespool'),
  ariaEexpanded_pool: true,
  ariaEexpanded_disk: true,

didInsertElement: function(){
  this.send('collapse_pool');
  this.send('collapse_disk');
},


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


  actions: {

    collapse_pool: function(){
      if(this.get('ariaEexpanded_pool')) {
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

    collapse_disk: function(){
      if(this.get('ariaEexpanded_disk')) {
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

  }

});
