import Component from '@ember/component';

export default Component.extend({

  diskName: function() {
    return this.get('disk.disk');
  }.property('disk.disk'),

  diskType: function() {
    return this.get('disk.disk_type');
  }.property('disk.disk_type'),

  availSize: function() {
    return this.get('disk.size');
  }.property('disk.size'),

  usedSize: function() {
    return this.get('disk.used_size');
  }.property('disk.used_size'),

});
