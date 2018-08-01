import Ember from 'ember';
import C from 'nilavu/utils/constants';

const { computed, get } = Ember;

export default Ember.Controller.extend({
  access: Ember.inject.service(),
  intl: Ember.inject.service(),
  // notifications: Ember.inject.service('notification-messages'),

  showPassword: false,

  bootstrap: function () {
    Ember.run.schedule('afterRender', this, () => {
      var user = Ember.$('.login-user')[0];
      var pass = Ember.$('.login-pass')[0];
      if (user) {
        if (user.value) {
          pass.focus();
        }
        else {
          user.focus();
        }
      }
    });
  }.on('init'),


  check() {
    this.get('username') != null && this.get('username') != "" ? this.set('val_username', '') : this.set('val_username', 'has-error');
    this.get('password') != null && this.get('password') != "" ? this.set('val_password', '') : this.set('val_password', 'has-error');
  },

  shouldProceed() {
    return Ember.isEmpty(this.get('val_username')) && Ember.isEmpty(this.get('val_password'));
  },

  actions: {
    toggleHiddenPassword: function () {
      this.toggleProperty('showPassword');
    },

    login: function () {
      this.check();
      if (this.shouldProceed()) {
        this.set('showSpinner', true);
        Ember.run.later(() => {
          this.get('access').login(this.get('username').toLowerCase(), this.get('password')).then(() => {
            this.set('showSpinner', false);
            this.send('trackUsage', C.ANALYTIC_EVENTS.LOGGED_IN);
            this.send('finishLogin');
          }).catch((err) => {
            if (err.code === '401') {
              this.get('notifications').warning(get(this, 'intl').t('notifications.invalidCredential'), {
                autoClear: true,
                clearDuration: 4200,
                cssClasses: 'notification-warning'
              });
            }
            if (err.status === 500) {
              this.get('notifications').warning(get(this, 'intl').t('notifications.somethingWentWrong'), {
                autoClear: true,
                clearDuration: 4200,
                cssClasses: 'notification-warning'
              });
            }
            this.set('showSpinner', false);
          }).finally(() => { });
        }, 10);
      }
    }
  },


  infoMsg: function () {
    if (this.get('errorMsg')) {
      return this.get('errorMsg');
    } else if (this.get('timedOut')) {
      return this.get('intl').t('loginPage.error.timedOut');
    } else {
      return '';
    }
  }.property('timedOut', 'errorMsg', 'intl._locale'),

});
