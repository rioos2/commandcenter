import Ember from 'ember';

export default Ember.Controller.extend({
  //intl: Ember.inject.service(),
  access: Ember.inject.service(),

  submitDisabled: function() {
   if (this.get('formSubmitted'))
    return true;
   if (this.get('emailValidation.failed'))
    return true;
   if (this.get('passwordValidation.failed'))
    return true;
   return false;
  }.property('emailValidation.failed', 'passwordValidation.failed', 'formSubmitted'),

  emailValidation: function() {
   if (Ember.isEmpty(this.get('loginEmail'))) {
    return {failed: true};
   }
   return {ok: true};
  }.property('loginEmail'),

  passwordValidation: function() {
   const password = this.get("loginPassword");

   if (Ember.isEmpty(this.get('loginPassword')))
    return {failed: true};
   if (password.length < 6)
    return {failed: true, reason: "Password length is too short"};
   return {ok: true};
  }.property('loginPassword'),

  actions: {

    login: function() {
      //this.send('started');
      this.set('formSubmitted', true);
      if (Ember.isEmpty(this.get('loginEmail')) || Ember.isEmpty(this.get('loginPassword'))) {
        //this.notificationMessages.error(this.get('intl').t('login.blank_email_or_password'));
        return;
      }
      this.set('loggingIn', true);
      Ember.run.later(() => {
        this.get('access').login(this.get('loginEmail'), this.get('loginPassword')).then(() => {
          this.send('finishLogin');
        }).catch((err) => {
         this.set('formSubmitted', false);
          this.set('waiting', false);

          if (err && err.status === 401) {
            //this.set('errorMsg', this.get('intl').t('loginPage.error.authFailed'));
          } else {
            //this.set('errorMsg', (err ? err.message : "No response received"));
          }
        }).finally(() => {
          this.set('waiting', false);
        });
      }, 10);
    }

  /*  login: function() {
      const self = this;
      if (Ember.isEmpty(this.get('loginEmail')) || Ember.isEmpty(this.get('loginPassword'))) {
        this.notificationMessages.error(this.get('intl').t('login.blank_email_or_password'));
        return;
      }

      this.set('loggingIn', true);

      Nilavu.ajax("/sessions", {
        data: {
          email: this.get('loginEmail'),
          password: this.get('loginPassword')
        },
        type: 'POST'
      }).then(function(result) {
        // Successful login
        if (result.error) {
          self.set('loggingIn', false);
          self.notificationMessages.error(result.error);
          return;
        } else {
          self.set('loggedIn', true);
          // Trigger the browser's password manager using the hidden static login form:
          const $hidden_login_form = $('#hidden-login-form');
          // const destinationUrl = $.cookie('destination_url');
          const shouldRedirectToUrl = self.session.get("shouldRedirectToUrl");
          // const ssoDestinationUrl = $.cookie('sso_destination_url');
          $hidden_login_form.find('input[name=username]').val(self.get('loginEmail'));
          $hidden_login_form.find('input[name=password]').val(self.get('loginPassword'));
          // if (destinationUrl) {
          //     // redirect client to the original URL
          //     $.cookie('destination_url', null);
          //     $hidden_login_form.find('input[name=redirect]').val(destinationUrl);
          // } else
          if (shouldRedirectToUrl) {
            self.session.set("shouldRedirectToUrl", null);
            $hidden_login_form.find('input[name=redirect]').val(shouldRedirectToUrl);
          } else {
            $hidden_login_form.find('input[name=redirect]').val(window.location.href);
          }

          if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) && navigator.userAgent.match(/Safari/g)) {
            // In case of Safari on iOS do not submit hidden login form
            window.location.href = $hidden_login_form.find('input[name=redirect]').val();
          } else {
            $hidden_login_form.submit();
          }

          return;
        }

      }, function(e) {
        if (e.jqXHR && e.jqXHR.status === 429) {
          this.notificationMessages.error(this.get('intl').t('login.rate_limit'));
        } else {
          this.notificationMessages.error(this.get('intl').t('login.error'));
        }
        self.set('loggingIn', false);
      });

      return false;
    },*/
  }

});
