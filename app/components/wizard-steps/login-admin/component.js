import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { get } from '@ember/object';
import { later } from '@ember/runloop';
export default Component.extend({
  access:        service(),
  intl:          service(),
  notifications: service('notification-messages'),

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
        later(() => {
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
    return isEmpty(this.get('val_username')) && isEmpty(this.get('val_password'));
  },

});
