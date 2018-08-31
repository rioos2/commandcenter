import { get } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { htmlSafe } from '@ember/string';

import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
export default Component.extend(DefaultHeaders, {
  intl:            service(),
  notifications:   service('notification-messages'),
  selectedNodes:   [],
  selectedBridges: [],
  type:            null,
  error:           false,

  virtualNetworks: function() {
    return C.AVAILABLE_NETWORK_TYPES;
  }.property(),

  hasIpTypeSelected: function(){
    return isEmpty(this.get('type'));
  }.property('type'),


  bridges: function() {
    if (!isEmpty(this.get('nodes'))) {
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
    this.set('error', this.requiredNodesToProceed());
  },

  actions: {
    updatePoolData(active, name, id) {
      this.assocateNodesWithBridges(active, name, id);
    },

    protocolSelected(value) {
      this.set('type', value);
    },

    bridgesSelected(active, value) {
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
    create() {
      this.set('showSpinner', true);
      if (!this.validation()) {
        this.get('userStore').rawRequest(this.rawRequestOpts({
          url:    '/api/v1/networks',
          method: 'POST',
          data:   this.getData(),
        })).then(() => {
          this.set('showInnerSpinner', true);
          this.set('showSpinner', false);
          this.sendAction('doReload');
          this.refresh();
        }).catch(() => {
          this.set('showSpinner', false);
          this.set('showInnerSpinner', false);
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

  },

  requiredNodesToProceed() {
    if (isEmpty(this.get('nodes'))) {
      this.set('pageWarning', get(this, 'intl').t('stackPage.admin.locations.add.nodesDisplayError'));

      return true;
    } else {
      return false;
    }
  },

  assocateNodesWithBridges(active, nodeName, id) {
    let matchedNodeId;
    const self = this;

    this.get('nodes').forEach((node) => {
      if (node.object_meta.name === nodeName) {
        matchedNodeId = node.id;
      }
    });
    if (!active && !isEmpty(this.get('selectedBridges'))) {
      self.get('selectedBridges').forEach((bridge) => {
        if (bridge.name == id){ // eslint-disable-line
          self.get('selectedBridges').removeObject(bridge);
        }
      });
    }

    active ? this.get('selectedNodes').addObject(matchedNodeId) : this.get('selectedNodes').removeObject(matchedNodeId);
  },

  verifyNetmask(ip) {
    return this.get('type').includes('ipv4') ? !ip.match(C.REGEX.IPV4.NETMASK) : !ip.match(C.REGEX.IPV6.NETMASK);
  },

  verifyIP(ip) {
    return this.get('type').includes('ipv4') ? !ip.match(C.REGEX.IPV4.IP) : !ip.match(C.REGEX.IPV6.IP);
  },

  verifySubnet(ip) {
    return this.get('type').includes('ipv4') ? !ip.match(C.REGEX.IPV4.SUBNET) : !ip.match(C.REGEX.IPV6.SUBNET);
  },

  verifyProtocol() {
    return !this.get('type').includes('ipv4') ? 'ipv6' : 'ipv4';
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
      if (this.verifyIP(this.get('gateway'))) {
        validationString = validationString.concat(get(this, 'intl').t(`stackPage.admin.network.gatewayError${  this.verifyProtocol() }`));
      }
    }
    if (!isEmpty(this.get('subnet'))) {
      if (this.verifySubnet(this.get('subnet'))) {
        validationString = validationString.concat(get(this, 'intl').t(`stackPage.admin.network.subnetRangeError${  this.verifyProtocol() }`));
      }
    }
    if (!isEmpty(this.get('netmask'))) {
      if (this.verifyNetmask(this.get('netmask'))) {
        validationString = validationString.concat(get(this, 'intl').t(`stackPage.admin.network.netmaskError${  this.verifyProtocol() }`));
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
