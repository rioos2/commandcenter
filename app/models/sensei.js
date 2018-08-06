import Resource from 'ember-api-store/models/resource';
import { isEmpty } from '@ember/utils';
import FilterCondition from 'nilavu/utils/filter-conditions';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import C from 'nilavu/utils/constants';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import $ from 'jquery';

var Sensei = Resource.extend(DefaultHeaders, {
  displayName:      alias('name'),
  availableActions: function() {
    // var a = this.get('actionLinks');

    return [
      {
        label:   'action.retryInstallNode',
        icon:    'fa fa-wrench',
        action:  'retryInstallSensei',
        enabled: this.senseiRetryInstallOption(),
      }
    ];
  }.property('id', 'actionLinks'),


  type:          'node',
  intl:          service(),
  session:       service(),
  notifications: service('notification-messages'),
  userStore:     service('user-store'),

  senseiRetryInstallOption() {
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

    retryInstallSensei() {
      this.set('nodeOperation', 'retry');
      $(`#node_auth_modal_${  this.get('id') }`).modal('show');
    }

  },
});

export default Sensei;
