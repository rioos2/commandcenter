import Ember from 'ember';

export default Ember.Controller.extend({

  access: Ember.inject.service(),
  name: Em.computed.alias('first_name'),

  getform() {
    let attrs = this.getProperties('name', 'email', 'first_name', 'last_name', 'firstname', 'password', 'phone');
    var unUsedAttrs = this.unUsedAccountFields();
    return $.extend(attrs, unUsedAttrs);
  },

  unUsedAccountFields() {
    let unUsedFields = {
      api_key: "",
      states: "",
      approval: "",
      suspend: "",
      registration_ip_address: "",
      roles: []
    };
    return unUsedFields;
  },


  actions: {
    singUp() {
      this.check();
      if (this.shouldProceed()) {
        Ember.run.later(() => {
          this.get('access').signup(this.getform()).then(() => {
            this.send('finishLogin');
          }).catch((err) => {

            if (err && err.status === 401) {
              //this.set('errorMsg', this.get('intl').t('loginPage.error.authFailed'));
            } else {
              //this.set('errorMsg', (err ? err.message : "No response received"));
            }
          }).finally(() => {});
        }, 10);
      }
    }

  },

  check() {
    this.get('company') != null && this.get('company') != "" ? this.set('val_company', '') : this.set('val_company', 'has-error');
    this.get('first_name') != null && this.get('first_name') != "" ? this.set('val_firstName', '') : this.set('val_firstName', 'has-error');
    this.get('last_name') != null && this.get('last_name') != "" ? this.set('val_lastName', '') : this.set('val_lastName', 'has-error');
    this.get('phone') != null && this.get('phone') != "" ? this.set('val_phone', '') : this.set('val_phone', 'has-error');
    this.get('password') != null && this.get('password') != "" ? this.set('val_code', '') : this.set('val_code', 'has-error');
    this.validationEmail(this.get('email')) && this.get('email') != "" ? this.set('val_email', '') : this.set('val_email', 'has-error');
  },

  validationEmail(value) {
    let emailReg = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test(value);
  },

  shouldProceed() {
    return Ember.isEmpty(this.get('val_company')) && Ember.isEmpty(this.get('val_firstName')) && Ember.isEmpty(this.get('val_lastName')) && Ember.isEmpty(this.get('val_phone')) && Ember.isEmpty(this.get('val_code')) && Ember.isEmpty(this.get('val_email'));
  },

});
