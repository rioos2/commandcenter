import Ember from 'ember';
export default Ember.Component.extend({

  networkName: function(){
    return this.get('model.object_meta.name');
  }.property('model.object_meta.name'),

  ip: function() {
    return this.get('model.subnet_ip');
  }.property('model.subnet_ip'),

  type: function() {
    return this.get('model.network_type');
  }.property('model.network_type'),
});
