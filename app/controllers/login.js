import Ember from 'ember';

export default Ember.Controller.extend({
  access: Ember.inject.service(),
  eyeStatus: false,

  check() {
    this.get('username') != null && this.get('username') != "" ? this.set('val_username', '') : this.set('val_username', 'has-error');
    this.get('password') != null && this.get('password') != "" ? this.set('val_password', '') : this.set('val_password', 'has-error');
  },

  shouldProceed() {
    return Ember.isEmpty(this.get('val_username')) && Ember.isEmpty(this.get('val_password'));
  },

  actions: {

    changeEye: function() {
      this.toggleProperty('eyeStatus');
    },

    login: function() {
      if (this.shouldProceed()) {
        Ember.run.later(() => {
          this.get('access').login(this.get('username'), this.get('password')).then(() => {
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

});
