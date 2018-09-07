import Ember from 'ember';
export default Ember.Component.extend({

  name: function() {
    return this.get('model.object_meta.name');
  }.property('model.object_meta.name'),

  type: function() {
    var networkTypes = [];
    var self = this;
    if (!Ember.isEmpty(this.get('virtualNetworks'))) {
      this.get('model.networks').forEach(function(net) {
        self.get('virtualNetworks').forEach(function(network) {
          if (net == network.id) {
            networkTypes.push(network.network_type);
          }
        });
      });
    }
    return networkTypes;
  }.property('virtualNetworks'),

  storagesInLocation: function() {
    var self = this;
    var strData = "";
    if (!Ember.isEmpty(this.get('storages'))) {
      self.get('storages').forEach(function(storage) {
        if (self.get('model.storage') == storage.id) {
          strData = storage.host_ip;
        }
      });
    }
    return strData;
  }.property('storages'),

  active: function() {
    return Ember.isEqual(this.get('selectedCluster'), this.get('model.id')) ? "active" : "";
  }.property('selectedCluster'),

});
