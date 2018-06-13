import Ember from 'ember';
export default Ember.Component.extend({

  networkName: function(){
    return this.get('model.object_meta.name');
  }.property('model.object_meta.name'),

  Location: function() {
    return this.get('model.object_meta.cluster_name');
  }.property('model.object_meta.cluster_name'),

  status: function() {
    return this.get('model.status.phase');
  }.property('model.status.phase'),

  active: function() {
    return Ember.isEqual(this.get('selectedBlockchainNetworkTab'),this.get('model.id'))? "active" :"";
  }.property('selectedBlockchainNetworkTab'),
});
