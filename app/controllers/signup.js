import Ember from 'ember';

export default Ember.Controller.extend({
  access: Ember.inject.service(),
  formSubmitted: false,
  name: Em.computed.alias('first_name'),

  getform() {
    let attrs = this.getProperties('name', 'email', 'first_name', 'last_name', 'firstname', 'password');
    var unUsedAttrs = this.unUsedAccountFields();
    return $.extend(attrs, unUsedAttrs);
  },

  unUsedAccountFields() {
    let unUsedFields = {
      phone: "",
      api_key: "",
      states: "",
      approval: "",
      suspend: "",
      registration_ip_address: "",
      roles: []
    };
    return unUsedFields;
  },

  submitDisabled: function() {
    if (this.get('formSubmitted'))
      return true;
    if (this.get('nameValidation.failed'))
      return true;
    if (this.get('emailValidation.failed'))
      return true;
    if (this.get('passwordValidation.failed'))
      return true;
    if (this.get('passwordConfirmValidation.failed'))
      return true;
    return false;
  }.property('nameValidation.failed', 'emailValidation.failed', 'passwordValidation.failed', 'passwordConfirmValidation.failed', 'formSubmitted'),

  nameValidation: function() {
    if (Ember.isEmpty(this.get('first_name')) || Ember.isEmpty(this.get('last_name'))) {
      return {
        failed: true
      };
    }
    return {
      ok: true
    };
  }.property('first_name', 'last_name'),

  emailValidation: function() {
    if (Ember.isEmpty(this.get('email'))) {
      return {
        failed: true
      };
    }
    return {
      ok: true
    };
  }.property('email'),

  passwordValidation: function() {
    const password = this.get("password");

    if (Ember.isEmpty(this.get('password')))
      return {
        failed: true
      };
    if (password.length < 6)
      return {
        failed: true,
        reason: "Password length is too short"
      };
    if (!Ember.isEmpty(this.get('email')) && this.get('password') === this.get('email'))
      return {
        failed: true,
        reason: "Password same as email"
      };
    return {
      ok: true
    };
  }.property('password', 'signupPasswordConfirm'),

  passwordConfirmValidation: function() {
    if (Ember.isEmpty(this.get('signupPasswordConfirm')))
      return {
        failed: true
      };

    if (!Ember.isEmpty(this.get('signupPasswordConfirm')) && this.get('password') === this.get('signupPasswordConfirm'))
      return {
        ok: true
      };

    if (!Ember.isEmpty(this.get('signupPasswordConfirm')) && this.get('password') !== this.get('signupPasswordConfirm'))
      return {
        failed: true,
        reason: "Password is not matching"
      };
  }.property('signupPasswordConfirm', 'password'),

  actions: {


    signup: function() {
      this.set('loggingIn', true);
      this.set('formSubmitted', true);
      Ember.run.later(() => {
        this.get('access').signup(this.getform()).then(() => {
          this.send('finishLogin');
        }).catch((err) => {
          this.set('waiting', false);

          if (err && err.status === 401) {
            this.set('formSubmitted', false);
            //this.set('errorMsg', this.get('intl').t('loginPage.error.authFailed'));
          } else {
            //this.set('errorMsg', (err ? err.message : "No response received"));
          }
        }).finally(() => {
          this.set('waiting', false);
        });
      }, 10);
    }
  }

});
