import {
  buildAdminInfraPanel
} from '../admin-infra-panel/component';
export default buildAdminInfraPanel('network', {
  network: null,
  selectedNodes: null,

  didInsertElement: function() {
    if (!Ember.isEmpty(this.get('networks'))) {
      this.send('SideData', this.get('networks').get('firstObject'));
    }
  },

  availableSize: function() {
    return this.get('networks').length;
  }.property('networks'),

  networkAvailable: function() {
    return this.get('availableSize') > 0 ;
  }.property('availableSize'),

  networks: function() {
    alert(JSON.stringify(this.get('model.networks.content')));

    return Ember.isEmpty(this.get('model.networks.content'))? [] : this.get('model.networks.content');
  }.property('model.networks.content'),

  nodes: function(){
    return this.get('model.nodes.content');
  }.property('model.nodes.content'),

  appliedNodesFor: function(network) {
    return this.get('nodes').map(function(node) {
      if (Object.keys(network.bridge_hosts).includes(node.id)){
        return node;
      }
    }).filter(val => val !== undefined);
  },

  actions: {
    SideData: function(net) {
      this.set('network', net);
      this.set('selectedNetwork', net.id);
      this.set('selectedNodes', this.appliedNodesFor(net));
    }
  }
});
