import Ember from 'ember';
const { computed, get} = Ember;

export default Ember.Controller.extend({

  access: Ember.inject.service(),
  store: Ember.inject.service(),
  intl:       Ember.inject.service(),
  userStore: Ember.inject.service('store'),
  name: Em.computed.alias('first_name'),
  emailExistence: true,

  getform() {
    this.set('email',this.get('email').toLowerCase());
    let attrs = this.getProperties('name', 'company_name', 'email', 'first_name', 'last_name', 'firstname', 'password', 'phone');
    var unUsedAttrs = this.unUsedAccountFields();
    return $.extend(attrs, unUsedAttrs);
  },

  unUsedAccountFields() {
    let unUsedFields = {
      registration_ip_address: "",
    };
    return unUsedFields;
  },

  emailFinders: function() {
    if(this.validationEmail(this.get('email'))) {
    var self = this;
    return this.get('userStore').rawRequest({
      url: '/api/v1/accounts/name/' + this.get('email').toLowerCase(),
      method: 'GET',
      headers: {
        'X-AUTH-RIOOS-EMAIL': this.get('email').toLowerCase(),
        'Authorization': 'Bearer ' + this.get('email').toLowerCase(),
      },
    }).then((xhr) => {
      self.set('val_email', 'has-error')
      self.set('emailExistence', false);
      self.set('emailErrorMsg', get(this, 'intl').t('notifications.emailExist'));
    }).catch((res) => {
      if (res.status === 401) {
        self.set('val_email', '')
        self.set('emailExistence', true);
      }
    });
  } else {
    this.set('val_email', '')
    this.set('emailExistence', true);
  }
  }.observes('email'),

  emailValidation: function() {
    if (this.validationEmail(this.get('email')) && this.get('email') != "") {
      this.set('val_email', '')
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
            this.send('finishLogin');
          }).catch((err) => {
              if (err.status == 500) {
                this.get('notifications').warning(get(this, 'intl').t('notifications.somethingWentWrong'), {
                  autoClear: true,
                  clearDuration: 4200,
                  cssClasses:'notification-warning'
                });
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
