import Ember from 'ember';
const { computed, get } = Ember;

import C from 'nilavu/utils/constants';

export default Ember.Component.extend({
  access:        Ember.inject.service(),
  intl:          Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),

  showPassword: false,

  didInsertElement() {
    this.get('notifications').warning(get(this, 'intl').t('wizard.loginWithRegisteredAccount'), {
      autoClear:     true,
      clearDuration: 4200,
      cssClasses:    'notification-success'
    });
  },

  actions: {
    toggleHiddenPassword() {
      this.toggleProperty('showPassword');
    },

    login() {
      this.check();
      if (this.shouldProceed()) {
        this.set('showSpinner', true);
        Ember.run.later(() => {
          this.get('access').login(this.get('username').toLowerCase(), this.get('password')).then(() => {
            this.set('showSpinner', false);
            this.get('completedSteps').pushObject(this.get('category'));
            this.sendAction('proceedNextStep');
          }).catch((err) => {
            if (err.code === '401') {
              this.get('notifications').warning(get(this, 'intl').t('notifications.invalidCredential'), {
                autoClear:     true,
                clearDuration: 4200,
                cssClasses:    'notification-warning'
              });
            }
            if (err.status === 500) {
              this.get('notifications').warning(get(this, 'intl').t('notifications.somethingWentWrong'), {
                autoClear:     true,
                clearDuration: 4200,
                cssClasses:    'notification-warning'
              });
            }
            this.set('showSpinner', false);
          })
            .finally(() => { });
        }, 10);
      }
    }
  },

  check() {
    this.get('username') != null && this.get('username') != '' ? this.set('val_username', '') : this.set('val_username', 'credential-empty');
    this.get('password') != null && this.get('password') != '' ? this.set('val_password', '') : this.set('val_password', 'credential-empty');
  },

  shouldProceed() {
    return Ember.isEmpty(this.get('val_username')) && Ember.isEmpty(this.get('val_password'));
  },

});
