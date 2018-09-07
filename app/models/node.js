import Resource from 'ember-api-store/models/resource';
import Ember from 'ember';
import FilterCondition from 'nilavu/utils/filter-conditions';
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
    return [{
        label: 'action.installNode',
        icon: 'fa fa-wrench',
        action: 'installNode',
        enabled: this.nodeInstallOption(),
      },
      {
        label: 'action.retryInstallNode',
        icon: 'fa fa-wrench',
        action: 'retryInstallNode',
        enabled: this.nodeRetryInstallOption(),
      }
    ];
  }.property('id', 'actionLinks'),

  nodeInstallOption: function() {
    let add = false;
    if (Ember.isEmpty(this.get("status.phase"))) {
      add = true;
    }
    return add;
  },

  nodeRetryInstallOption: function() {
    let add = FilterCondition.nodeRetryInstallCondition(this.get('status.conditions'));
    if (C.NODE.INSTALLFAILURE.includes(this.get("status.phase"))) {
      add = true;
    };
    if (Ember.isEmpty(this.get("status.phase"))) {
      add = false;
    };
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
