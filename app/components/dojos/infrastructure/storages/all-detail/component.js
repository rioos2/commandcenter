import Component from '@ember/component';

export default Component.extend({

  storageName: function(){
    return this.get('model.object_meta.name');
  }.property('model.object_meta.name'),

  ip: function() {
    return this.get('model.host_ip');
  }.property('model.host_ip'),

  type: function() {
    return this.get('model.storage_type');
  }.property('model.storage_type'),

  active: function() {
    return this.get('selectedStorage') === this.get('model.id') ? 'active' : '';
  }.property('selectedStorage'),

});
