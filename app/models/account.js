import Resource from 'ember-api-store/models/resource';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';


var Account = Resource.extend(DefaultHeaders, {

  availableActions: function() {

    return [{
      label:   'actions.makeAdmin',
      action:  'makeAsAdmin',
      enabled: !this.get('is_admin'),
    },
    {
      label:   'actions.revokeAdmin',
      action:  'revokeAdmin',
      enabled: this.get('is_admin'),
    },
    {
      label:   'actions.makeSuspend',
      action:  'suspendUser',
      enabled: !this.get('suspend'),
    },
    {
      label:   'actions.revokeSuspend',
      action:  'revokeSuspendedUser',
      enabled: this.get('suspend'),
    },
    ];
  }.property('id', 'actionLinks', 'is_admin', 'suspend'),

  intl:          service(),
  notifications: service('notification-messages'),
  modalService:  service('modal'),

  updateAccount(data, action) {
    this.get('store').request(this.rawRequestOpts({
      url:    `/api/v1/accounts/${  this.get('id') }`,
      method: 'PUT',
      data,
    })).then(() => {
      this.get('notifications').info(get(this, 'intl').t(`account.userManagement.${ action }.success`, { email: this.get('email') }), {
        autoClear:     true,
        clearDuration: 4200,
        cssClasses:    'notification-success'
      });
    }).catch(() => {
      this.get('notifications').warning(get(this, 'intl').t(`account.userManagement.${ action }.failed`), {
        autoClear:     true,
        clearDuration: 4200,
        cssClasses:    'notification-warning'
      });
    });
    this.get('modalService').toggleModal();

  },


  actions: {

    makeAsAdmin(){
      this.get('modalService').toggleModal('action-popup/user-make-admin', this);
    },

    suspendUser(){
      this.get('modalService').toggleModal('action-popup/user-suspend', this);
    },

    revokeAdmin(){
      this.get('modalService').toggleModal('action-popup/user-revoke-admin', this);
    },

    revokeSuspendedUser(){
      this.get('modalService').toggleModal('action-popup/user-revoke-suspend', this);
    },

  },
  type:    'account',
});

export default Account;
