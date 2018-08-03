import Ember from 'ember';
const { get } = Ember;

import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
export default Ember.Component.extend(DefaultHeaders, {
  intl:            Ember.inject.service(),
  notifications:   Ember.inject.service('notification-messages'),
  selectedNodes:   [],
  selectedBridges: [],
  type:            null,
  error:           false,

  virtualNetworks: function() {
    return C.AVAILABLE_NETWORK_TYPES;
  }.property(),

  active: function(){
    return Ember.isEmpty(this.get('type'));
  }.property('type'),


  nodeBridgeData: function() {
    if (!Ember.isEmpty(this.get('nodes'))) {
      return this.get('nodes').map((node) => {
        var data = {
          name:    node.object_meta.name,
          node_id: node.id,
          bridges: [],
        };

        node.status.node_info.bridges.forEach((name) => {
          data.bridges.addObject({
            value: name.bridge_name,
            types: name.network_types,
          });
        });

        return data;
      });
    }

    return [];
  }.property('nodes'),

  didInsertElement() {
    this.set('error', this.displayMessage());
  },

  actions: {
    updatePoolData(active, name) {
      this.attachAndDetachNode(active, name);
    },

    setVirtualNetwork(value) {
      this.set('type', value);
    },

    setBridge(active, value) {
      var self = this;

      self.get('selectedBridges').forEach((bridge) => {
        if (bridge.name == value.name) {
          self.get('selectedBridges').removeObject(bridge);
        }
      });
      if (active) {
        self.get('selectedBridges').addObject(value);
      }
    },

    createVirtualNetwork() {
      this.set('showSpinner', true);
      if (!this.validation()) {
        this.get('userStore').rawRequest(this.rawRequestOpts({
          url:    '/api/v1/networks',
          method: 'POST',
          data:   this.getData(),
        })).then((xhr) => {
          this.set('modelSpinner', true);
          this.set('showSpinner', false);
          this.sendAction('doReload');
          this.refresh();
        }).catch((err) => {
          this.set('showSpinner', false);
          this.set('modelSpinner', false);
        });
      } else {
        this.set('showSpinner', false);
        this.get('notifications').warning(Ember.String.htmlSafe(this.get('validationWarning')), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      }
    },

  },

  displayMessage() {
    if (Ember.isEmpty(this.get('nodes'))) {
      this.set('pageWarning', get(this, 'intl').t('stackPage.admin.locations.add.nodesDisplayError'));

      return true;
    } else {
      return false;
    }
  },

  attachAndDetachNode(active, nodeName) {
    let data;

    this.get('nodes').forEach((node) => {
      if (node.object_meta.name == nodeName) {
        data = node.id;
      }
    });
    active ? this.get('selectedNodes').addObject(data) : this.get('selectedNodes').removeObject(data);
  },

  checkNetmaskFormate(ip) {
    return this.get('type').includes('ipv4') ? !ip.match(C.REGEX.IPV4.NETMASK) : !ip.match(C.REGEX.IPV6.NETMASK);
  },

  checkIpFormate(ip) {
    return this.get('type').includes('ipv4') ? !ip.match(C.REGEX.IPV4.IP) : !ip.match(C.REGEX.IPV6.IP);
  },

  checkSubnetFormate(ip) {
    return this.get('type').includes('ipv4') ? !ip.match(C.REGEX.IPV4.SUBNET) : !ip.match(C.REGEX.IPV6.SUBNET);
  },

  checkIpType() {
    return !this.get('type').includes('ipv4') ? 'ipv6' : 'ipv4';
  },

  validation() {
    var validationString = '';

    if (Ember.isEmpty(this.get('name'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.nameError'));
    }
    if (Ember.isEmpty(this.get('type'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.typeError'));
    }
    if (Ember.isEmpty(this.get('netmask'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.netmaskError'));
    }
    if (Ember.isEmpty(this.get('subnet'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.subnetError'));
    }
    if (Ember.isEmpty(this.get('selectedBridges'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.brigeHostError'));
    }
    if (Ember.isEmpty(this.get('gateway'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.gatewayError'));
    }

    if (!Ember.isEmpty(this.get('gateway'))) {
      if (this.checkIpFormate(this.get('gateway'))) {
        validationString = validationString.concat(get(this, 'intl').t(`stackPage.admin.network.gatewayError${  this.checkIpType() }`));
      }
    }
    if (!Ember.isEmpty(this.get('subnet'))) {
      if (this.checkSubnetFormate(this.get('subnet'))) {
        validationString = validationString.concat(get(this, 'intl').t(`stackPage.admin.network.subnetRangeError${  this.checkIpType() }`));
      }
    }
    if (!Ember.isEmpty(this.get('netmask'))) {
      if (this.checkNetmaskFormate(this.get('netmask'))) {
        validationString = validationString.concat(get(this, 'intl').t(`stackPage.admin.network.netmaskError${  this.checkIpType() }`));
      }
    }

    if (Ember.isEmpty(this.get('selectedNodes'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.nodesError'));
    }
    if (this.get('selectedNodes').length != this.get('selectedBridges').length) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.bridgeError'));
    }
    this.set('validationWarning', validationString);

    return Ember.isEmpty(this.get('validationWarning')) ? false : true;
  },

  getBridge(data) {
    var bridge_hst = {};

    data.forEach((ele) => {
      bridge_hst[ele.name] = ele.value;
    });

    return bridge_hst;
  },

  getData() {
    return {
      network_type: this.get('type'),
      subnet_ip:    this.get('subnet'),
      netmask:      this.get('netmask'),
      gateway:      this.get('gateway'),
      bridge_hosts: this.getBridge(this.get('selectedBridges')),
      object_meta:  { name: this.get('name'), },
      status:       { phase: 'Pending' }
    };
  },
  refresh() {
    this.setProperties({
      type:            '',
      subnet:          '',
      gateway:         '',
      netmask:         '',
      name:            '',
      selectedBridges: [],
      selectedNodes:   [],
    });
  },

});
