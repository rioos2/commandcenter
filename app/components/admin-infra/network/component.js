import {
  buildAdminInfraPanel
} from '../admin-infra-panel/component';
export default buildAdminInfraPanel('network', {
  virtualNetwork: null,
  selectedNodes: null,

  didInsertElement: function() {
    if (!Ember.isEmpty(this.get('virtualNetworks'))) {
      this.send('SideData', this.get('virtualNetworks').get('firstObject'));
    }
  },

  availableSize: function() {
    return this.get('virtualNetworks').length;
  }.property('virtualNetworks'),

  virtualNetworkAvailable: function() {
    return this.get('availableSize') > 0 ;
  }.property('availableSize'),

  virtualNetworks: function() {
    return Ember.isEmpty(this.get('model.networks.content'))? [] : this.get('model.networks.content');
  }.property('model.networks.content'),

  nodes: function(){
    return this.get('model.nodes.content');
  }.property('model.nodes.content'),

  appliedNodesFor: function(virtualNetwork) {
    return this.get('nodes').map(function(node) {
      if (Object.keys(virtualNetwork.bridge_hosts).includes(node.id)){
        return node;
      }
    }).filter(val => val !== undefined);
  },

  actions: {
    SideData: function(net) {
      this.set('virtualNetwork', net);
      this.set('selectedVirtualNetwork', net.id);
      this.set('selectedNodes', this.appliedNodesFor(net));
    }
  }
});
