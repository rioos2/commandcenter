import Ember from 'ember';
import C from 'nilavu/utils/constants';
export default Ember.Component.extend({

  name: function(){
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
    return Ember.isEmpty(this.get('model.status.phase')) ? "" : this.get('model.status.phase').capitalize();
  }.property('model.status.phase'),

  virtualNetworkAvailable: function() {
    return !(Ember.isEmpty(this.get('status')) && Ember.isEmpty(this.get('name')) && Ember.isEmpty(this.get('subnet')) && Ember.isEmpty(this.get('type')) && Ember.isEmpty(this.get('gateway')));
  }.property('status','name','type','gateway','subnet'),

actions: {
  openEditModal: function(){
    $('#network_edit').modal('show');
  },

  doReloaded: function() {
    this.sendAction('virtualNetworkReload');
  }

}

});
