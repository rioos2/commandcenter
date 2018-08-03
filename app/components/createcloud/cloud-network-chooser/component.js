/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';
const { get } = Ember;

export default Ember.Component.extend({
  intl:          Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  networks:      {
    'private_ipv4': 'Private IPv4',
    'public_ipv4':  'Public IPv4',
    'private_ipv6': 'Private IPv6',
    'public_ipv6':  'Public IPv6'
  },
  disabledNetworks: [],

  initializeChart: Ember.on('didInsertElement', function() {
    this.waringMessage();
  }),

  selectedVirtualNetworks: function() {
    var self = this;
    var virtualNetworks = Object.keys(this.get('networks')).map((key) => {
      return key;
    });

    this.get('disabledNetworks').map((disable) => {
      self.set(disable, '');
    });

    if (!Ember.isEmpty(this.get('model.stacksfactory.object_meta.cluster_name')) && !Ember.isEmpty(this.get('model.datacenters.content')) && !Ember.isEmpty(self.get('model.networks.content'))) {
      this.get('model.datacenters.content').filter((location) => {
        if (Ember.isEqual(location.object_meta.name, self.get('model.stacksfactory.object_meta.cluster_name'))) {
          location.networks.map((network_id) => {
            self.get('model.networks.content').map((network) => {
              if (Ember.isEqual(network.id, network_id)) {
                virtualNetworks.removeObject(network.network_type);
              }
            });
          });
        }
      });
    }
    this.disableNetworks(virtualNetworks);
  }.property('model.stacksfactory.object_meta.cluster_name'),

  actions: {
    selected(net_type) {
      var self = this;

      this.set('model.stacksfactory.network', '');
      this.toggleProperty(`${ net_type  }_check`);
      if (this.checkActiveNetwork(net_type)) {
        var cc = this.get('model.stacksfactory.resources');

        if (!cc[net_type]) {
          cc[net_type] = 'true';
          this.set(net_type, 'selected');
        } else {
          this.set(net_type, '');
          delete cc[net_type];
        }
        this.set('model.stacksfactory.resources', cc);
      }
      Object.keys(this.get('networks')).map((key) => {
        Object.keys(self.get('model.stacksfactory.resources')).map((network_type) => {
          if (Ember.isEqual(key, network_type)) {
            self.set('model.stacksfactory.network', network_type);
          }
        });
      });
    }
  },

  disableNetworks(disableNetworks = []) {
    this.set('disabledNetworks', disableNetworks);
    disableNetworks.forEach((disable) => {
      this.set(disable, 'disable-network');
    });
  },

  waringMessage() {
    if (Ember.isEmpty(this.get('model.networks.content'))) {
      this.get('notifications').warning(get(this, 'intl').t('notifications.network.empty'), {
        autoClear:     true,
        clearDuration: 6000,
        cssClasses:    'notification-warning'
      });
    }
  },

  checkActiveNetwork(network) {
    var active = true;

    this.get('disabledNetworks').forEach((n) => {
      if (n === network) {
        active = false;
      }
    });

    return active;
  },

});
