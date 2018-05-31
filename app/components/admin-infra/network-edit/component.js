import Ember from 'ember';
const {
  get
} = Ember;
import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
export default Ember.Component.extend(DefaultHeaders, {
  intl: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  error: false,
  selectedBridges: [],
  selectedNodes: [],

  setNodeAndBridge: function() {
    var self = this;
    if (!Ember.isEmpty(this.get('network.bridge_hosts'))) {
      Object.keys(self.get('network.bridge_hosts')).map(function(key) {
        self.get('selectedNodes').addObject(key);
        self.get('selectedBridges').addObject({
          name: key,
          value: self.get('network.bridge_hosts.' + `${key}`)
        });
      });
    }
  },

  nodeBridgeData: function() {
    var self = this;
    this.set('selectedNodes', []);
    this.set('selectedBridges', []);
    this.setNodeAndBridge();
    if (!Ember.isEmpty(this.get('allnodes'))) {
      var bridgeEnable = false;
      return this.get('allnodes').map(function(node) {
        var data = {
          name: node.object_meta.name,
          node_id: node.id,
          active_bridge: self.get('network.bridge_hosts.' + `${node.id}`),
          bridges: [],
          active: false,
        };
        if (!Ember.isEmpty(self.get('network.bridge_hosts'))) {
          Object.keys(self.get('network.bridge_hosts')).filter(function(key) {
            if (Ember.isEqual(key, node.id)) {
              data.active = true;
            }
          });
          node.status.node_info.bridges.forEach(function(name) {
            data.bridges.addObject({
              value: name.bridge_name,
              types: name.network_types,
            });
          });
        }
        return data;
      });
    };
    return [];
  }.property('allnodes', 'network'),

  virtualNetworks: function() {
    return !Ember.isEmpty(this.get('type')) ? C.AVAILABLE_NETWORK_TYPES : [];
  }.property('type'),

  active: function() {
    return Ember.isEmpty(this.get('network.used_bits'));
  }.property('network.used_bits'),

  name: function() {
    return this.get('network.object_meta.name');
  }.property('network.object_meta.name'),

  subnet: function() {
    return this.get('network.subnet_ip');
  }.property('network.subnet_ip'),

  type: function() {
    return this.get('network.network_type');
  }.property('network.network_type'),

  status: function() {
    return this.get('network.status.phase');
  }.property('network.status.phase'),

  netmask: function() {
    return this.get('network.netmask');
  }.property('network.netmask'),

  gateway: function() {
    return this.get('network.gateway');
  }.property('network.gateway'),

  getBridge: function(data) {
    var bridge_hst = {};
    data.forEach(function(ele) {
      bridge_hst[ele.name] = ele.value;
    });
    return bridge_hst;
  },

  getData: function() {
    this.set('network.object_meta.name', this.get('name'));
    return {
      network_type: this.get('type'),
      subnet_ip: this.get('subnet'),
      netmask: this.get('netmask'),
      used_bits: this.get('model.used_bits'),
      gateway: this.get('gateway'),
      status: this.get('network.status'),
      bridge_hosts: this.getBridge(this.get('selectedBridges')),
      object_meta: this.get('network.object_meta')
    };
  },
  validation() {
    var validationString = "";
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
        validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.gatewayError' + this.checkIpType()));
      }
    }
    if (!Ember.isEmpty(this.get('subnet'))) {
      if (this.checkSubnetFormate(this.get('subnet'))) {
        validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.subnetRangeError' + this.checkIpType()));
      }
    }
    if (!Ember.isEmpty(this.get('netmask'))) {
      if (this.checkNetmaskFormate(this.get('netmask'))) {
        validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.netmaskError' + this.checkIpType()));
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

  checkNetmaskFormate: function(ip) {
    return this.get('type').includes('ipv4') ? !ip.match(C.REGEX.IPV4.NETMASK) : !ip.match(C.REGEX.IPV6.NETMASK);
  },

  checkIpFormate: function(ip) {
    return this.get('type').includes('ipv4') ? !ip.match(C.REGEX.IPV4.IP) : !ip.match(C.REGEX.IPV6.IP);
  },

  checkSubnetFormate: function(ip) {
    return this.get('type').includes('ipv4') ? !ip.match(C.REGEX.IPV4.SUBNET) : !ip.match(C.REGEX.IPV6.SUBNET);
  },

  checkIpType: function() {
    return !this.get('type').includes('ipv4') ? "ipv6" : "ipv4";
  },

  attachAndDetachNode: function(active, nodeName) {
    let data;
    this.get('allnodes').forEach(function(node) {
      if (node.object_meta.name == nodeName) {
        data = node.id;
      }
    });
    active ? this.get('selectedNodes').addObject(data) : this.get('selectedNodes').removeObject(data);
  },
  actions: {

    editVirtualNetwork: function() {
      this.set('showSpinner', true);
      if (!this.validation()) {
        this.get('userStore').rawRequest(this.rawRequestOpts({
          url: '/api/v1/networks/' + this.get('network.id'),
          method: 'PUT',
          data: this.getData(),
        })).then((xhr) => {
          this.set('showSpinner', false);
          this.set('modelSpinner', true);
          this.sendAction('doReloaded');
        }).catch((err) => {
          this.set('showSpinner', false);
          this.set('modelSpinner', false);
        });
      } else {
        this.set('showSpinner', false);
        this.get('notifications').warning(Ember.String.htmlSafe(this.get('validationWarning')), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-warning'
        });
      }
    },
    setVirtualNetwork: function(value) {
      this.set('type', value);

    },
    updatePoolData: function(active, name) {
      this.attachAndDetachNode(active, name);
    },

    setBridge: function(active, value) {
      var self = this;
      self.get('selectedBridges').forEach(function(bridge) {
        if (bridge.name == value.name) {
          self.get('selectedBridges').removeObject(bridge);
        }
      });
      if (active) {
        self.get('selectedBridges').addObject(value);
      }
    },
  }

});
