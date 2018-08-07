import Resource from 'ember-api-store/models/resource';
import FilterCondition from 'nilavu/utils/filter-conditions';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import C from 'nilavu/utils/constants';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import $ from 'jquery';

var Node = Resource.extend(DefaultHeaders, {
  displayName:      alias('name'),
  availableActions: function() {

    return [{
      label:   'action.installNode',
      icon:    'fa fa-wrench',
      action:  'installNode',
      enabled: this.nodeInstallOption(),
    },
    {
      label:   'action.retryInstallNode',
      icon:    'fa fa-wrench',
      action:  'retryInstallNode',
      enabled: this.nodeRetryInstallOption(),
    }
    ];
  }.property('id', 'actionLinks'),

  type:          'node',
  intl:          service(),
  session:       service(),
  notifications: service('notification-messages'),
  userStore:     service('user-store'),

  nodeInstallOption() {
    let add = false;

    if (isEmpty(this.get('status.phase'))) {
      add = true;
    }

    return add;
  },

  nodeRetryInstallOption() {
    let add = FilterCondition.nodeRetryInstallCondition(this.get('status.conditions'));

    if (C.NODE.INSTALLFAILURE.includes(this.get('status.phase'))) {
      add = true;
    }
    if (isEmpty(this.get('status.phase'))) {
      add = false;
    }

    return add;
  },


  actions: {

    installNode() {
      this.set('nodeOperation', 'install');
      $(`#node_auth_modal_${  this.get('id') }`).modal('show');
    },

    retryInstallNode() {
      this.set('nodeOperation', 'retry');
      $(`#node_auth_modal_${  this.get('id') }`).modal('show');
    }

  },
});

export default Node;
