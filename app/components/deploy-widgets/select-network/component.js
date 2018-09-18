import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { isEqual } from '@ember/utils';
import { alias } from '@ember/object/computed';
import {
  get, set, computed
} from '@ember/object';

export default Component.extend({
  intl:                    service(),
  notifications:           service('notification-messages'),
  networksPatten:      {
    'private_ipv4': 'Private IPv4',
    'public_ipv4':  'Public IPv4',
    'private_ipv6': 'Private IPv6',
    'public_ipv6':  'Public IPv6'
  },
  disabledNetworks: [],

  stacksfactoryObjectMeta: alias('stacksfactory.object_meta'),
  clusterName:             alias('stacksfactoryObjectMeta.cluster_name'),
  initializeChart:         on('didInsertElement', function() {
    this.waringMessage();
  }),

  selectedVirtualNetworks: computed('clusterName', function() {
    var self = this;
    var virtualNetworks = Object.keys(get(this, 'networksPatten')).map((key) => {
      return key;
    });

    get(this, 'disabledNetworks').map((disable) => {
      self.set(disable, '');
    });

    if (!isEmpty(get(this, 'clusterName')) && !isEmpty(get(this, 'datacenters.content')) && !isEmpty(self.get('networks.content'))) {
      get(this, 'datacenters.content').filter((location) => {
        if (isEqual(location.object_meta.name, self.get('clusterName'))) {
          location.networks.map((network_id) => {
            self.get('networks.content').map((network) => {
              if (isEqual(network.id, network_id)) {
                virtualNetworks.removeObject(network.network_type);
              }
            });
          });
        }
      });
    }
    this.disableNetworks(virtualNetworks);
  }),

  actions: {
    selected(net_type) {
      var self = this;

      set(this, 'stacksfactory.network', '');
      this.toggleProperty(`${ net_type  }_check`);
      if (this.checkActiveNetwork(net_type)) {
        var cc = get(this, 'stacksfactory.resources');

        if (!cc[net_type]) {
          cc[net_type] = 'true';
          set(this, net_type, 'selected');
        } else {
          set(this, net_type, '');
          delete cc[net_type];
        }
        set(this, 'stacksfactory.resources', cc);
      }
      Object.keys(get(this, 'networksPatten')).map((key) => {
        Object.keys(self.get('stacksfactory.resources')).map((network_type) => {
          if (isEqual(key, network_type)) {
            self.set('stacksfactory.network', network_type);
          }
        });
      });
    }
  },

  disableNetworks(disableNetworks = []) {
    set(this, 'disabledNetworks', disableNetworks);
    disableNetworks.forEach((disable) => {
      set(this, disable, 'disable-network');
    });
  },

  waringMessage() {
    if (isEmpty(get(this, 'networks.content'))) {
      get(this, 'notifications').warning(get(this, 'intl').t('notifications.network.empty'), {
        autoClear:     true,
        clearDuration: 6000,
        cssClasses:    'notification-warning'
      });
    }
  },

  checkActiveNetwork(network) {
    var active = true;

    get(this, 'disabledNetworks').forEach((n) => {
      if (n === network) {
        active = false;
      }
    });

    return active;
  },

});
