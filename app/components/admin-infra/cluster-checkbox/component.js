import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'rio-radio',
  active: false,

  virtualNetworkFilterForNode: function() {
    var self = this;
    var selectedVirtualNetworkForNode = [];
    if (!Ember.isEmpty(this.get('virtualNetworks'))) {
      self.get('virtualNetworks').map(function(network) {
        Object.keys(network.bridge_hosts).filter(function(key) {
          if (Ember.isEqual(key, self.get('data.id'))) {
            selectedVirtualNetworkForNode.addObject({
              name: network.object_meta.name,
              id: network.id
            });
          }
        });
      });
    }
    return selectedVirtualNetworkForNode;
  }.property('virtualNetworks'),


  actions: {
    sendType() {
      this.toggleProperty('active');
      this.sendAction('updateData', this.get('active'), this.get('data.id'));
    },

    updateVirtualNetworkData: function(select, data) {
      select ? this.get('selectedVirtualNetworks').push(data) : this.get('selectedVirtualNetworks').removeObject(data);
    },
  }
});
