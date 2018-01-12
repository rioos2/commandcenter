import Ember from 'ember';

export default Ember.Controller.extend({
  access: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
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
      this.check();
      if (this.shouldProceed()) {
        Ember.run.later(() => {
          this.get('access').login(this.get('username'), this.get('password')).then(() => {
            this.send('finishLogin');
          }).catch((err) => {
            if (err.code === '401') {
              this.get('notifications').error('Incorrect login details used', {
                autoClear: true,
                clearDuration: 4200
              });
            }
          }).finally(() => {});
        }, 10);
      }
    }
  },

});
