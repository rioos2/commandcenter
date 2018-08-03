import SignupValidation from 'nilavu/mixins/signup-validation';
import EmailValidation from 'nilavu/mixins/email-validation';
import PasswordValidation from 'nilavu/mixins/password-validation';
import { get } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { later } from '@ember/runloop';

export default Controller.extend(SignupValidation, EmailValidation, PasswordValidation, {

  access:            service(),
  store:             service(),
  intl:              service(),
  userStore:         service('store'),
  emailExistence:    true,
  passwordRequired:  true,
  passwordMinLength: 8,
  name:              alias('first_name'),
  email:             alias('accountEmail'),
 //validating fields for signup
  validate:          function() {
    if (this.get('companyNameValidation.failed')) {
      this.set('validationError', this.get('companyNameValidation.reason'));

      return true;
    }
    if (this.get('fullNameValidation.failed')) {
      this.set('validationError', this.get('fullNameValidation.reason'));

      return true;
    }
    if (this.get('lastNameValidation.failed')) {
      this.set('validationError', this.get('lastNameValidation.reason'));

      return true;
    }
    if (this.get('phoneValidation.failed')) {
      this.set('validationError', this.get('phoneValidation.reason'));

      return true;
    }
    if (this.get('emailValidation.failed')) {
      this.set('validationError', this.get('emailValidation.reason'));

      return true;
    }
    if (this.get('passwordValidation.failed')) {
      this.set('validationError', this.get('passwordValidation.reason'));

      return true;
    }
    this.set('validationError', '');

    return false;
  }.property(
    'companyNameValidation.failed',
    'fullNameValidation.failed',
    'lastNameValidation.failed',
    'phoneValidation.failed',
    'emailValidation.failed',
    'passwordValidation.failed',
  ),


  actions: {
    signUp() {
      this.showCredentialEmpty();
      if (!this.get('validate')) {

        later(() => {
          this.get('access').signup(this.getform()).then(() => {
            this.send('finishLogin');
          }).catch((err) => {
            if (err.status == 500) {
              this.get('notifications').warning(get(this, 'intl').t('notifications.somethingWentWrong'), {
                autoClear:     true,
                clearDuration: 4200,
                cssClasses:    'notification-warning'
              });
            }
            //Show error message if emailid already exist
            if (err.code == '409') {
              this.set('val_email', 'credential-empty');
              this.set('emailErrorMsg', get(this, 'intl').t('notifications.emailExist'));
              this.set('emailExistence', false);
            }
          })
            .finally(() => {});
        }, 10);
      } else {
        if (this.get('validationError')) {
          this.get('notifications').warning(this.get('validationError'), {
            autoClear:     true,
            clearDuration: 4200,
            cssClasses:    'notification-warning'
          });
        }
      }
    }
  },
  getform() {
    this.set('accountEmail', this.get('accountEmail').toLowerCase());
    let attrs = this.getProperties('name', 'company_name', 'email', 'first_name', 'last_name', 'firstname', 'phone', 'password');
    var unUsedAttrs = this.unUsedAccountFields();
    return $.extend(attrs, unUsedAttrs);
  },

  unUsedAccountFields() {
    let unUsedFields = { registration_ip_address: '', };

    return unUsedFields;
  },
  //notify if there is any errors
  showCredentialEmpty() {
    this.get('companyNameValidation.failed') ? this.set('val_company', 'credential-empty') : this.set('val_company', '');
    this.get('fullNameValidation.failed') ? this.set('val_firstName', 'credential-empty') : this.set('val_firstName', '');
    this.get('lastNameValidation.failed') ? this.set('val_lastName', 'credential-empty') : this.set('val_lastName', '');
    this.get('phoneValidation.failed') ? this.set('val_phone', 'credential-empty') : this.set('val_phone', '');
    this.get('emailValidation.failed') ? this.set('val_email', 'credential-empty') : this.set('val_email', '');
    this.get('passwordValidation.failed') ? this.set('val_code', 'credential-empty') : this.set('val_code', '');
  },

});
