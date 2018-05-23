import {
  buildAdminInfraPanel
} from '../admin-infra-panel/component';
export default buildAdminInfraPanel('locations', {

  selectedLocations: null,
  selectedStorage: null,
  selectedNodes: null,
  selectedVirtualNetworks: null,

  didInsertElement: function() {
    if (!Ember.isEmpty(this.get('locations'))) {
      this.send('SideData', this.get('locations').get('firstObject'));
    }
  },

  availableSize: function() {
    return this.get('locations').length;
  }.property('locations'),

  locationAvailable: function() {
    return this.get('availableSize') > 0;
  }.property('availableSize'),

  locations: function() {
    return Ember.isEmpty(this.get('model.datacenters.content'))? [] : this.get('model.datacenters.content');
  }.property('model.datacenters.content'),

  nodes: function() {
    return Ember.isEmpty(this.get('model.nodes.content'))? [] : this.get('model.nodes.content');
  }.property('model.nodes.content'),

  storages: function() {
    return Ember.isEmpty(this.get('model.storageConnectors.content'))? [] : this.get('model.storageConnectors.content');
  }.property('model.storageConnectors.content'),

  virtualNetworks: function() {
    return Ember.isEmpty(this.get('model.networks.content'))? [] : this.get('model.networks.content');
  }.property('model.networks.content'),

  filterStoragesFor: function(location) {
    var self = this;
    var name;
    self.get('storages').forEach(function(storage) {
      if (location.storage == storage.id) {
        name = storage.object_meta.name;
      }
    });
    return name;
  },

  filterNodesIn: function(location) {
    return this.get('nodes').map(function(node) {
      if (location.nodes.includes(node.id)) {
        return node;
      }
    }).filter(val => val !== undefined);
  },

  filterNetworksIn: function(location) {
    return this.get('virtualNetworks').map(function(network) {
      if (location.networks.includes(network.id)) {
        return network;
      }
    }).filter(val => val !== undefined);
  },

  actions: {
    SideData: function(location) {
      this.set('selectedLocations', location);
      this.set('selectedCluster', location.id);
      this.set('selectedStorage', this.filterStoragesFor(location));
      this.set('selectedVirtualNetworks', this.filterNetworksIn(location));
      this.set('selectedNodes', this.filterNodesIn(location));
    }
  }

});
