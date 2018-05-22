import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'rio-radio',
  active: false,

  NetworkFilterForNode: function() {
    var self = this;
    var selectedNetworkForNode = [];
    if (!Ember.isEmpty(this.get('networks'))) {
      self.get('networks').map(function(network) {
        Object.keys(network.bridge_hosts).filter(function(key) {
          if (Ember.isEqual(key, self.get('data.id'))) {
            selectedNetworkForNode.addObject({
              name: network.object_meta.name,
              id: network.id
            });
          }
        });
      });
    }
    return selectedNetworkForNode;
  }.property('networks'),


  actions: {
    sendType() {
      this.toggleProperty('active');
      this.sendAction('updateData', this.get('active'), this.get('data.id'));
    },

    updateNetworkData: function(select, data) {
      select ? this.get('selectedNetworks').push(data) : this.get('selectedNetworks').removeObject(data);
    },
  }
});
