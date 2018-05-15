import {
  buildAdminInfraPanel
} from '../admin-infra-panel/component';
export default buildAdminInfraPanel('network', {
  network: null,
  nodes: null,

  didInsertElement: function() {
    if (!Ember.isEmpty(this.get('networks'))) {
      this.send('SideData', this.get('networks').get('firstObject'));
    }
  },

  count: function() {
    return this.get('model.networks.content').length;
  }.property('model.networks.content'),

  networkFound: function() {
    return this.get('model.networks.content').length > 0 ;
  }.property('model'),

  networks: function() {
    return this.get('model.networks.content');
  }.property('model.networks.content'),

  getNode: function(network) {
    var node_list = [];
    var self = this;
    self.get('model.nodes.content').forEach(function(node) {
      Object.keys(self.get('network.bridge_hosts')).forEach(function(key) {
        if (key == node.id) {
          node_list.push(node);
        }
      });
    });
    return node_list;
  },

  actions: {
    SideData: function(net) {
      this.set('network', net);
      this.set('nodes', this.getNode(net));
    }
  }


});
