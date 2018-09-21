import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { isEqual } from '@ember/utils';

export default Component.extend({
  tagName: 'rio-radio',
  active:  false,

  virtualNetworkFilterForNode: function() {
    var self = this;
    var selectedVirtualNetworkForNode = [];

    if (!isEmpty(this.get('virtualNetworks'))) {
      self.get('virtualNetworks').map((network) => {
        Object.keys(network.bridge_hosts).filter((key) => {
          if (isEqual(key, self.get('data.id'))) {
            selectedVirtualNetworkForNode.addObject({
              name: network.object_meta.name,
              id:   network.id
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

    updateVirtualNetworkData(select, data) {
      select ? this.get('selectedVirtualNetworks').push(data) : this.get('selectedVirtualNetworks').removeObject(data);
    },
  }
});
