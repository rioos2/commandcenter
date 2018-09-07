import C from 'nilavu/utils/constants';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { schedule } from '@ember/runloop';
import $ from 'jquery';
import { later } from '@ember/runloop';
import LoginValidation from 'nilavu/mixins/login-validation';


export default Controller.extend(LoginValidation, {

  access:        service(),
  intl:          service(),
  notifications: service('notification-messages'),

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
    schedule('afterRender', this, () => {
      var user = $('.login-user')[0];
      var pass = $('.login-pass')[0];

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
      return this.get('intl').t('loginPage.error.session_timeout');
    } else {
      return '';
    }
  }.property('timedOut', 'errorMsg', 'intl._locale'),

  actions: {
    toggleHiddenPassword() {
      this.toggleProperty('showPassword');
    },

    login() {
      this.required();
      if (!this.get('validate')) {
        this.set('showSpinner', true);
        later(() => {
          this.get('access').login(this.get('username').toLowerCase(), this.get('password')).then(() => {
            this.set('showSpinner', false);
            this.send('trackUsage', C.ANALYTIC_EVENTS.LOGGED_IN);
            this.send('finishLogin');
          }).catch((err) => {
            // err.code from api_gateway is return a string. It's desireable send it as int
            if (C.UNAUTHENTICATED_HTTP_CODES.includes(parseInt(err.code))) {
              this.get('notifications').warning(get(this, 'intl').t('loginPage.error.username_password_incorrect'), {
                autoClear:     true,
                clearDuration: 4200,
                cssClasses:    'notification-warning'
              });
            }
            if (C.INTERNALSERVER_ERROR === parseInt(err.status)) {
              this.get('notifications').warning(get(this, 'intl').t('error.apiserver_is_down'), {
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

  required() {
    this.get('userNameValidation.failed') ?  this.set('userNameValidate', 'credential-empty') : this.set('userNameValidate', '');
    this.get('passwordValidation.failed') ? this.set('passwordValidate', 'credential-empty') : this.set('passwordValidate', '');
  },

});
