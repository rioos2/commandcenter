import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { isEqual } from '@ember/utils';

export default Component.extend({

  name: function() {
    return this.get('model.object_meta.name');
  }.property('model.object_meta.name'),

  type: function() {
    var networkTypes = [];
    var self = this;

    if (!isEmpty(this.get('virtualNetworks'))) {
      this.get('model.networks').forEach((net) => {
        self.get('virtualNetworks').forEach((network) => {
          if (net === network.id) {
            networkTypes.push(network.network_type);
          }
        });
      });
    }

    return networkTypes;
  }.property('virtualNetworks'),

  storagesInLocation: function() {
    var self = this;
    var strData = '';

    if (!isEmpty(this.get('storages'))) {
      self.get('storages').forEach((storage) => {
        if (self.get('model.storage') === storage.id) {
          strData = storage.host_ip;
        }
      });
    }

    return strData;
  }.property('storages'),

  active: function() {
    return isEqual(this.get('selectedCluster'), this.get('model.id')) ? 'active' : '';
  }.property('selectedCluster'),

});
