import Ember from 'ember';
const {
  get
} = Ember;
import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
export default Ember.Component.extend(DefaultHeaders,{
  intl: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  selectedNodes: [],
  bridgeNames: [],
  selectedBriges: [],
  bridgeHost: [],

  networkList: function(){
    return C.AVAILABLE_NETWORK_TYPES;
  }.property(),

  nodeNameList: function() {
    var nodeNames = [];
    if (!Ember.isEmpty(this.get('nodes'))) {
      this.get('nodes').forEach(function(node) {
        nodeNames.push(node.object_meta.name);
      });
    }
    return nodeNames;
  }.property('nodes'),

  bridges: function() {
    var self = this;
    self.set('bridgeNames', []);
    self.get('selectedNodes').forEach(function(node_id) {
      if (!Ember.isEmpty(self.get('nodes'))) {
        self.get('nodes').forEach(function(node) {
          if ((node.id == node_id) && !Ember.isEmpty(node.status.node_info.bridges)) {
            node.status.node_info.bridges.forEach(function(bridge) {
              self.get('bridgeNames').addObject({
                name: node_id,
                value: bridge.bridge_name
              });
            });
          }
        });
      }
    });
  }.observes('selectedNodes.@each'),


  attachAndDetachNode: function(active, nodeName) {
    let data;
    this.get('nodes').forEach(function(node) {
      if (node.object_meta.name == nodeName) {
        data = node.id;
      }
    });
    active ? this.get('selectedNodes').addObject(data) : this.get('selectedNodes').removeObject(data);
  },

  attachAndDetachBridge: function(active, bridge) {
    var self = this;
    let data;
    self.get('bridgeHost').forEach(function(bridgehost) {
      if (bridgehost.name == bridge.name && bridgehost.value == birdge.value) {
        data = bridge;
      }
    });
    active ? self.get('bridgeHost').addObject(bridge) : self.get('bridgeHost').removeObject(bridge);
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
    } else if (Ember.isEmpty(this.get('bridgeHost'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.network.brigeHostError'));
      return true;
    } else if (Ember.isEmpty(this.get('selectedNodes'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.network.nodesError'));
      return true;
    } else {
      return false;
    }
  },

  getBridge: function(data){
    var bridge_hst= {};
    data.forEach(function(ele){
      bridge_hst[ele.name]=ele.value;
    });
    return bridge_hst;
  },

  getData: function(){
    return {
      network_type: this.get('type'),
      subnet_ip: this.get('subnet'),
      netmask: this.get('netmask'),
      gateway: this.get('gateway'),
      bridge_hosts: this.getBridge(this.get('bridgeHost')),
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
    showBridgesForNode: function(active, bridge) {
      this.attachAndDetachBridge(active, bridge);
    },

    setNetwork: function(value){
      this.set('type',value);
    },

    createNetwork: function() {
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
