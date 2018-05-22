import Ember from 'ember';
const {
  get
} = Ember;
import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
export default Ember.Component.extend(DefaultHeaders, {
  intl: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  selectedNodes: [],
  selectedBridges: [],

  virtualNetworks: function() {
    return C.AVAILABLE_NETWORK_TYPES;
  }.property(),

  nodeBridgeData: function() {
    if (!Ember.isEmpty(this.get('nodes'))) {
      return this.get('nodes').map(function(node) {
        var data = {
          name: node.object_meta.name,
          node_id: node.id,
          bridges: [],
        };
        node.status.node_info.bridges.forEach(function(name) {
          data.bridges.addObject({
            value: name.bridge_name,
          });
        });
        return data;
      });
    };
    return [];
  }.property('nodes'),

  attachAndDetachNode: function(active, nodeName) {
    let data;
    this.get('nodes').forEach(function(node) {
      if (node.object_meta.name == nodeName) {
        data = node.id;
      }
    });
    active ? this.get('selectedNodes').addObject(data) : this.get('selectedNodes').removeObject(data);
  },

  validation() {
    if (Ember.isEmpty(this.get('name'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.network.nameError'));
      return true;
    } else
    if (Ember.isEmpty(this.get('type'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.network.typeError'));
      return true;
    } else
    if (Ember.isEmpty(this.get('gateway'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.network.gatewayError'));
      return true;
    } else
    if (Ember.isEmpty(this.get('netmask'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.network.netmaskError'));
      return true;
    } else
    if (Ember.isEmpty(this.get('subnet'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.network.subnetError'));
      return true;
    } else if (Ember.isEmpty(this.get('selectedBridges'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.network.brigeHostError'));
      return true;
    } else if (Ember.isEmpty(this.get('selectedNodes'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.network.nodesError'));
      return true;
    } else {
      return false;
    }
  },

  getBridge: function(data) {
    var bridge_hst = {};
    data.forEach(function(ele) {
      bridge_hst[ele.name] = ele.value;
    });
    return bridge_hst;
  },

  getData: function() {
    return {
      network_type: this.get('type'),
      subnet_ip: this.get('subnet'),
      netmask: this.get('netmask'),
      gateway: this.get('gateway'),
      bridge_hosts: this.getBridge(this.get('selectedBridges')),
      object_meta: {
        name: this.get('name'),
      },
      status: {
        phase: "Pending"
      }
    };
  },

  actions: {
    updatePoolData: function(active, name) {
      this.attachAndDetachNode(active, name);
    },

    setVirtualNetwork: function(value) {
      this.set('type', value);
    },

    setBridge: function(active, value) {
      var self = this;
      self.get('selectedBridges').forEach(function(bridge) {
        if (bridge.name == value.name) {
          self.get('selectedBridges').removeObject(bridge);
        }
      });
      if(active){
        self.get('selectedBridges').addObject(value);
      }
    },

    createVirtualNetwork: function() {
      this.set('showSpinner', true);
      if (!this.validation()) {
        this.get('userStore').rawRequest(this.rawRequestOpts({
          url: '/api/v1/networks',
          method: 'POST',
          data: this.getData(),
        })).then((xhr) => {
          this.set('showSpinner', false);
          location.reload();
        }).catch((err) => {
          this.set('showSpinner', false);
        });
      } else {
        this.set('showSpinner', false);
        this.get('notifications').warning(this.get('validationWarning'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-warning'
        });
      }
    },

  }

});
