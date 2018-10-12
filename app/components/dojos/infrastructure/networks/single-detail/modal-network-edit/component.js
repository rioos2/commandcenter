import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { isEqual } from '@ember/utils';
import { isEmpty } from '@ember/utils';
import { htmlSafe } from '@ember/string';

import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
export default Component.extend(DefaultHeaders, {
  intl:               service(),
  notifications:      service('notification-messages'),
  error:              false,
  selectedBridges:    [],
  selectedNodes:      [],
  virtualNetworkType: '',

  nodeBridgeData: function() {
    var self = this;

    this.set('selectedNodes', []);
    this.set('selectedBridges', []);
    if (isEqual(this.get('selectedType'), this.get('type'))){
      this.setNodeAndBridge();
    }
    if (!isEmpty(this.get('allnodes'))) {
      var bridge_name = '';

      return this.get('allnodes').map((node) => {
        self.get('selectedBridges').map((bridge) => {
          bridge_name = isEqual(bridge.name, node.id) ? bridge.value : '';
        });
        var data = {
          name:          node.object_meta.name,
          node_id:       node.id,
          active_bridge: bridge_name,
          bridges:       [],
          active:        !isEmpty(bridge_name),
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
  }.property('allnodes', 'network', 'type'),


  typeSelectionChanged: function() {
    isEqual(this.get('selectedType'), this.get('type')) ? this.setDefaultValues() : this.refresh();
  }.observes('type'),

  networkSelectionChanged: function(){
    this.setDefaultValues();
  }.observes('network'),

  virtualNetworks: function() {
    return !isEmpty(this.get('type')) ? C.AVAILABLE_NETWORK_TYPES : [];
  }.property('type'),

  active: function() {
    return isEmpty(this.get('network.used_bits'));
  }.property('network.used_bits'),

  typeSelect: function() {
    this.set('type', this.get('network.network_type'));
  }.observes('network.network_type'),

  status: function() {
    return this.get('network.status.phase');
  }.property('network.status.phase'),

  selectedType: function() {
    return this.get('type');
  }.property('network.network_type'),

  actions: {

    editVirtualNetwork() {
      this.set('showSpinner', true);
      if (!this.validation()) {
        this.get('userStore').rawRequest(this.rawRequestOpts({
          url:    `/api/v1/networks/${  this.get('network.id') }`,
          method: 'PUT',
          data:   this.getData(),
        })).then(() => {
          this.set('showSpinner', false);
          this.set('modelSpinner', true);
          this.sendAction('doReloaded');
        }).catch(() => {
          this.set('showSpinner', false);
          this.set('modelSpinner', false);
        });
      } else {
        this.set('showSpinner', false);
        this.get('notifications').warning(htmlSafe(this.get('validationWarning')), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      }
    },
    setVirtualNetwork(value) {
      this.set('type', value);
    },
    updatePoolData(active, name, id) {
      this.attachAndDetachNode(active, name, id);
    },

    setBridge(active, value) {
      var self = this;

      self.get('selectedBridges').forEach((bridge) => {
        if (bridge.name === value.name) {
          self.get('selectedBridges').removeObject(bridge);
        }
      });
      if (active) {
        self.get('selectedBridges').addObject(value);
      }
    },
  },

  setNodeAndBridge() {
    var self = this;

    if (!isEmpty(this.get('network.bridge_hosts'))) {
      Object.keys(self.get('network.bridge_hosts')).map((key) => {
        self.get('selectedNodes').addObject(key);
        self.get('selectedBridges').addObject({
          name:  key,
          value: self.get('network.bridge_hosts.' + `${ key }`)
        });
      });
    }
  },

  refresh() {
    this.setProperties({
      subnet:  '',
      gateway: '',
      netmask: '',
    });
  },

  setDefaultValues() {
    this.setProperties({
      name:    this.get('network.object_meta.name'),
      subnet:  this.get('network.subnet_ip'),
      gateway: this.get('network.gateway'),
      netmask: this.get('network.netmask'),
    });
  },

  getBridge(data) {
    var bridge_hst = {};

    data.forEach((ele) => {
      bridge_hst[ele.name] = ele.value;
    });

    return bridge_hst;
  },

  getData() {
    this.set('network.object_meta.name', this.get('name'));

    return {
      network_type: this.get('type'),
      subnet_ip:    this.get('subnet'),
      netmask:      this.get('netmask'),
      used_bits:    this.get('model.used_bits'),
      gateway:      this.get('gateway'),
      status:       this.get('network.status'),
      bridge_hosts: this.getBridge(this.get('selectedBridges')),
      object_meta:  this.get('network.object_meta')
    };
  },
  validation() {
    var validationString = '';

    if (isEmpty(this.get('name'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.nameError'));
    }
    if (isEmpty(this.get('type'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.typeError'));
    }
    if (isEmpty(this.get('netmask'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.netmaskError'));
    }
    if (isEmpty(this.get('subnet'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.subnetError'));
    }
    if (isEmpty(this.get('selectedBridges'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.brigeHostError'));
    }
    if (isEmpty(this.get('gateway'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.gatewayError'));
    }

    if (!isEmpty(this.get('gateway'))) {
      if (this.checkIpFormate(this.get('gateway'))) {
        validationString = validationString.concat(get(this, 'intl').t(`stackPage.admin.network.gatewayError${  this.checkIpType() }`));
      }
    }
    if (!isEmpty(this.get('subnet'))) {
      if (this.checkSubnetFormate(this.get('subnet'))) {
        validationString = validationString.concat(get(this, 'intl').t(`stackPage.admin.network.subnetRangeError${  this.checkIpType() }`));
      }
    }
    if (!isEmpty(this.get('netmask'))) {
      if (this.checkNetmaskFormate(this.get('netmask'))) {
        validationString = validationString.concat(get(this, 'intl').t(`stackPage.admin.network.netmaskError${  this.checkIpType() }`));
      }
    }

    if (isEmpty(this.get('selectedNodes'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.nodesError'));
    }
    if (this.get('selectedNodes').length !== this.get('selectedBridges').length) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.network.bridgeError'));
    }
    this.set('validationWarning', validationString);

    return isEmpty(this.get('validationWarning')) ? false : true;
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

  attachAndDetachNode(active, nodeName, id) {
    let data;
    const self = this;

    this.get('allnodes').forEach((node) => {
      if (node.object_meta.name === nodeName) {
        data = node.id;
      }
    });
    if (!active && !isEmpty(this.get('selectedBridges'))) {
      self.get('selectedBridges').forEach((bridge) => {
        if (bridge.name == id){ // eslint-disable-line
          self.get('selectedBridges').removeObject(bridge);
        }
      });
    }
    active ? this.get('selectedNodes').addObject(data) : this.get('selectedNodes').removeObject(data);
  },
});