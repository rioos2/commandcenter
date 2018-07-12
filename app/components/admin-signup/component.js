import Ember from 'ember';
const { computed, get} = Ember;
import C from 'nilavu/utils/constants';

export default Ember.Component.extend({

  access: Ember.inject.service(),
  store: Ember.inject.service(),
  intl:       Ember.inject.service(),
  userStore: Ember.inject.service('store'),
  name: Em.computed.alias('first_name'),
  emailExistence: true,

  getform() {
    this.set('email',this.get('email').toLowerCase());
    let attrs = this.getProperties('name', 'company_name', 'email', 'first_name', 'last_name', 'firstname', 'password', 'phone');
    var externalFields = this.externalAccountFields();
    return $.extend(attrs, externalFields);
  },

  externalAccountFields() {
    let externalFields = {
      registration_ip_address: "",
      roles:[C.ACCOUNT.ROLES.SUPERUSER],
    };
    return externalFields;
  },

  emailValidation: function() {
    if (this.validationEmail(this.get('email')) && this.get('email') != "") {
      this.set('val_email', '')
      this.set('emailExistence', true);
    } else {
      this.set('val_email', 'has-error');
      this.set('emailErrorMsg', get(this, 'intl').t('notifications.validEmail'));
      this.set('emailExistence', false);
    }
  },


  actions: {
    singUp() {
      this.check();
      if (this.shouldProceed()) {
        Ember.run.later(() => {
          this.get('access').signup(this.getform()).then(() => {
            this.sendAction('nextStep');
          }).catch((err) => {
              if (err.status == 500) {
                this.get('notifications').warning(get(this, 'intl').t('notifications.somethingWentWrong'), {
                  autoClear: true,
                  clearDuration: 4200,
                  cssClasses:'notification-warning'
                });
              }
              if (err.code == '409') {
                this.set('val_email', 'has-error');
                this.set('emailErrorMsg', get(this, 'intl').t('notifications.emailExist'));
                this.set('emailExistence', false);
              }
          }).finally(() => {});
        }, 10);
      }
    }

  },

  check() {
    this.get('company_name') != null && this.get('company_name') != "" ? this.set('val_company', '') : this.set('val_company', 'has-error');
    this.get('first_name') != null && this.get('first_name') != "" ? this.set('val_firstName', '') : this.set('val_firstName', 'has-error');
    this.get('last_name') != null && this.get('last_name') != "" ? this.set('val_lastName', '') : this.set('val_lastName', 'has-error');
    this.get('phone') != null && this.get('phone') != "" ? this.set('val_phone', '') : this.set('val_phone', 'has-error');
    this.get('password') != null && this.get('password') != "" ? this.set('val_code', '') : this.set('val_code', 'has-error');
    this.emailValidation();
  },

  validationEmail(value) {
    let emailReg = /^([\w-.]+@([\w-]+\.)+[\w-]{2,15})?$/;
    return emailReg.test(value);
  },

  shouldProceed() {
    return Ember.isEmpty(this.get('val_company')) && Ember.isEmpty(this.get('val_firstName')) && Ember.isEmpty(this.get('val_lastName')) && Ember.isEmpty(this.get('val_phone')) && Ember.isEmpty(this.get('val_code')) && Ember.isEmpty(this.get('val_email'));
  },

});
