import Ember from 'ember';
export default Ember.Component.extend({

  name: function() {
    return this.get('model.object_meta.name');
  }.property('model'),

  type: function() {
    return this.get('model.network_type');
  }.property('model.network_type'),

  subnet: function() {
    return this.get('model.subnet_ip');
  }.property('model.subnet_ip'),

  gateway: function() {
    return this.get('model.gateway');
  }.property('model.gateway'),

  netmask: function() {
    return this.get('model.netmask');
  }.property('model.netmask'),

  status: function() {
    return this.get('model.status.phase');
  }.property('model.status.phase'),

  nodes: function() {
    return this.get('node');
  }.property('node'),
});
