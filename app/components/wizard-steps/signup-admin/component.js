import Component from '@ember/component';
import C from 'nilavu/utils/constants';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { get } from '@ember/object';
import { later } from '@ember/runloop';

export default Component.extend({
  notifications: service('notification-messages'),
  access:         service(),
  store:          service(),
  intl:           service(),
  userStore:      service('store'),
  tagName:       '',
  className:     '',

  emailExistence: true,

  name:    computed.alias('first_name'),
  actions: {
    singUp() {
      this.check();
      if (this.shouldProceed()) {
        later(() => {
          this.get('access').signup(this.getFormInput()).then(() => {
            this.get('completedSteps').pushObject(this.get('category'));
            this.sendAction('proceedNextStep');
          }).catch((err) => {
            if (err.status === C.INTERNALSERVER_ERROR) {
              this.get('notifications').warning(get(this, 'intl').t('notifications.somethingWentWrong'), {
                autoClear:     true,
                clearDuration: 4200,
                cssClasses:    'notification-warning'
              });
            }
            if (err.code === C.INTERNAL_CONFLICTS) {
              this.set('val_email', 'credential-empty');
              this.set('emailErrorMsg', get(this, 'intl').t('notifications.emailExist'));
              this.set('emailExistence', false);
            }
          })
            .finally(() => {});
        }, 10);
      }
    }

  },

  getFormInput() {
    this.set('email', this.get('email').toLowerCase());
    let attrs = this.getProperties('name', 'company_name', 'email', 'first_name', 'last_name', 'firstname', 'password', 'phone');
    var externalFields = this.externalAccountFields();

    return $.extend(attrs, externalFields);
  },

  externalAccountFields() {
    let externalFields = {
      registration_ip_address: '',
      teams:                   [C.ACCOUNT.ROLES.SUPERUSER],
    };

    return externalFields;
  },

  emailValidation() {
    if (this.validationEmail(this.get('email')) && this.get('email') !== '') {
      this.set('val_email', '')
      this.set('emailExistence', true);
    } else {
      this.set('val_email', 'credential-empty');
      this.set('emailErrorMsg', get(this, 'intl').t('notifications.validEmail'));
      this.set('emailExistence', false);
    }
  },


  check() {
    this.get('company_name') !== null && this.get('company_name') !== '' ? this.set('val_company', '') : this.set('val_company', 'credential-empty');
    this.get('first_name') !== null && this.get('first_name') !== '' ? this.set('val_firstName', '') : this.set('val_firstName', 'credential-empty');
    this.get('last_name') !== null && this.get('last_name') !== '' ? this.set('val_lastName', '') : this.set('val_lastName', 'credential-empty');
    this.get('phone') !== null && this.get('phone') !== '' ? this.set('val_phone', '') : this.set('val_phone', 'credential-empty');
    this.get('password') !== null && this.get('password') !== '' ? this.set('val_code', '') : this.set('val_code', 'credential-empty');
    this.emailValidation();
  },

  validationEmail(value) {
    let emailReg = /^([\w-.]+@([\w-]+\.)+[\w-]{2,15})?$/;

    return emailReg.test(value);
  },

  shouldProceed() {
    return isEmpty(this.get('val_company')) && isEmpty(this.get('val_firstName')) && isEmpty(this.get('val_lastName')) && isEmpty(this.get('val_phone')) && isEmpty(this.get('val_code')) && isEmpty(this.get('val_email'));
  },

});
