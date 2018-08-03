import Ember from 'ember';
import C from 'nilavu/utils/constants';
import InputValidation from 'nilavu/models/input-validation';
import LoginValidation from 'nilavu/mixins/login-validation';
const {
  computed,
  get
} = Ember;

export default Ember.Controller.extend(LoginValidation, {

  // LoginValidation validate username, password
  access:        Ember.inject.service(),
  intl:          Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),

  showPassword: false,

  validate: function() {
    if (this.get('userNameValidation.failed')) {
      this.set('validationError', this.get('userNameValidation.reason'));

      return true;
    }
    if (this.get('passwordValidation.failed')) {
      this.set('validationError', this.get('passwordValidation.reason'));

      return true;
    }
    this.set('validationError', '');

    return false;
  }.property(
    'userNameValidation.failed',
    'passwordValidation.failed'
  ),

  bootstrap: function() {
    Ember.run.schedule('afterRender', this, () => {
      var user = Ember.$('.login-user')[0];
      var pass = Ember.$('.login-pass')[0];

      if (user) {
        if (user.value) {
          pass.focus();
        } else {
          user.focus();
        }
      }
    });
  }.on('init'),

  infoMsg: function() {
    if (this.get('errorMsg')) {
      return this.get('errorMsg');
    } else if (this.get('timedOut')) {
      return this.get('intl').t('loginPage.error.timedOut');
    } else {
      return '';
    }
  }.property('timedOut', 'errorMsg', 'intl._locale'),

  actions: {
    toggleHiddenPassword() {
      this.toggleProperty('showPassword');
    },

    login() {
      this.showCredentialEmpty();
      if (!this.get('validate')) {
        this.set('showSpinner', true);
        Ember.run.later(() => {
          this.get('access').login(this.get('username').toLowerCase(), this.get('password')).then(() => {
            this.set('showSpinner', false);
            this.send('trackUsage', C.ANALYTIC_EVENTS.LOGGED_IN);
            this.send('finishLogin');
          }).catch((err) => {
            // err.code from api_gateway is return a string. It's desireable send it as int
            if (C.UNAUTHENTICATED_HTTP_CODES.includes(parseInt(err.code))) {
              this.get('notifications').warning(get(this, 'intl').t('notifications.invalidCredential'), {
                autoClear:     true,
                clearDuration: 4200,
                cssClasses:    'notification-warning'
              });
            }
            if (err.status === C.INTERNALSERVER_HTTP_CODES) {
              this.get('notifications').warning(get(this, 'intl').t('notifications.somethingWentWrong'), {
                autoClear:     true,
                clearDuration: 4200,
                cssClasses:    'notification-warning'
              });
            }
            this.set('showSpinner', false);
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

  showCredentialEmpty() {
    this.get('userNameValidation.failed') ?  this.set('userNameValidate', 'credential-empty') : this.set('userNameValidate', '');
    this.get('passwordValidation.failed') ? this.set('passwordValidate', 'credential-empty') : this.set('passwordValidate', '');
  },

});
