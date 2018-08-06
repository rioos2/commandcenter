import { isEmpty } from '@ember/utils';
import { buildAdminInfraPanel } from '../admin-infra-panel/component';
import $ from 'jquery';


export default buildAdminInfraPanel('locations', {

  selectedLocations:       null,
  selectedStorage:         null,
  selectedNodes:           null,
  selectedVirtualNetworks: null,

  didInsertElement() {
    if (!isEmpty(this.get('locations'))) {
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
    return isEmpty(this.get('model.datacenters.content')) ? [] : this.get('model.datacenters.content');
  }.property('model.datacenters.content.@each'),

  nodes: function() {
    return isEmpty(this.get('model.nodes.content')) ? [] : this.get('model.nodes.content');
  }.property('model.nodes.content.@each'),

  storages: function() {
    return isEmpty(this.get('model.storageConnectors.content')) ? [] : this.get('model.storageConnectors.content');
  }.property('model.storageConnectors.content.@each'),

  virtualNetworks: function() {
    return isEmpty(this.get('model.networks.content')) ? [] : this.get('model.networks.content');
  }.property('model.networks.content.@each'),

  filterStoragesFor(location) {
    var self = this;
    var name;

    self.get('storages').forEach((storage) => {
      if (location.storage === storage.id) {
        name = storage.object_meta.name;
      }
    });

    return name;
  },

  filterNodesIn(location) {
    return this.get('nodes').map((node) => {
      if (location.nodes.includes(node.id)) {
        return node;
      }
    }).filter((val) => val !== undefined);
  },

  filterNetworksIn(location) {
    return this.get('virtualNetworks').map((network) => {
      if (location.networks.includes(network.id)) {
        return network;
      }
    }).filter((val) => val !== undefined);
  },

  actions: {
    SideData(location) {
      this.set('selectedLocations', location);
      this.set('selectedCluster', location.id);
      this.set('selectedStorage', this.filterStoragesFor(location));
      this.set('selectedVirtualNetworks', this.filterNetworksIn(location));
      this.set('selectedNodes', this.filterNodesIn(location));
    },

    doReload() {
      $('#addcluster_modal').modal('hide');
      this.sendAction('triggerReload');
    },

    openModal() {
      $('#addcluster_modal').modal('show');
    }
  }

});
