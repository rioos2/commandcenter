import Resource from 'ember-api-store/models/resource';
import Ember from 'ember';

import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';
import C from 'nilavu/utils/constants';

const {
  get
} = Ember;
import {
  denormalizeName
} from 'nilavu/utils/denormalize';

var Node = Resource.extend(DefaultHeaders, {
  type: 'node',
  displayName: Ember.computed.alias('name'),
  intl: Ember.inject.service(),
  session: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  userStore: Ember.inject.service('user-store'),

  availableActions: function() {
    var a = this.get('actionLinks');
    return [
      {
        label: 'action.installNode',
        icon: 'fa fa-plus',
        action: 'installNode',
        enabled: this.nodeInstallOption(),
      },
      {
        label: 'action.retryInstallNode',
        icon: 'fa fa-plus',
        action: 'retryInstallNode',
        enabled: this.nodeRetryInstallOption(),
      }
    ];
  }.property('id', 'actionLinks'),

  nodeInstallOption: function() {
    let add = true;
    this.get('status.conditions').forEach((condition) => {
      if (C.NODE.NINJA_NODES_UNINSTALL_CONDITIONS.includes(condition.condition_type)) {
        add = false;
      };
    });
    return add;
  },

  nodeRetryInstallOption: function() {
    let add = true;
    this.get('status.conditions').forEach((condition) => {
      if (C.NODE.NINJA_NODES_RETRY_INSTALL_CONDITIONS.includes(condition.condition_type)) {
        add = false;
      };
    });
    return add;
  },


  actions: {

    installNode() {
      this.set('nodeOperation', 'install');
      $('#node_auth_modal_' + this.get('id')).modal('show');
    },

    retryInstallNode() {
      this.set('nodeOperation', 'retry');
      $('#node_auth_modal_' + this.get('id')).modal('show');
    }

  },
});

export default Node;
