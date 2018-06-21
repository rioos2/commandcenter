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
    return [{
        label: 'action.nodeInstall',
        icon: 'fa fa-plus',
        action: 'installnode',
        enabled: this.nodeCreationOption(),
        // enabled: true,
      },
      {
        label: 'action.createSecret',
        icon: 'fa fa-plus',
        action: 'secretCreate',
        enabled: true,
      }
    ];
  }.property('id', 'actionLinks'),

  nodeCreationOption: function() {
    let add = true;
    this.get('status.conditions').forEach((condition) => {
      if (C.NODE.NINJANODESCONDITIONS.includes(condition.condition_type)) {
        add = false;
      };
    });
    return add;
  },


  actions: {

    installnode() {
      var self = this;
      this.get('userStore').rawRequest(this.rawRequestOpts({
        url: '/api/v1/nodes',
        method: 'POST',
        data: this,
      })).then((result) => {
        this.get('notifications').info(get(this, 'intl').t('stackPage.admin.node.nodeCreate'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-success'
        });
      }).catch(err => {
        this.get('notifications').warning(get(this, 'intl').t('stackPage.admin.node.nodeFailed'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-warning'
        });
      });
    },
    secretCreate() {
      $('#node_auth_modal_' + this.get('id')).modal('show');
    }

  },
});

export default Node;
