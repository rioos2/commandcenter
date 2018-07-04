import Component from '@ember/component';
import DefaultHeaders from 'nilavu/mixins/default-headers';
const { get} = Ember;

export default Component.extend(DefaultHeaders, {
  intl: Ember.inject.service(),
  session: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  showIcon: true,
  licenseToken: "",
  showSpinner: false,

  placeHolder: function() {
    return get(this, 'intl').t('stackPage.admin.settings.entitlement.placeHolder');
  }.property('placeHolder'),

  status: function() {
    return this.get('model.trial') ? get(this, 'intl').t('stackPage.admin.settings.entitlement.trial') : this.get('model.status');
  }.property('model.status'),

  validation: function() {
    var validationString = "";
    if (Ember.isEmpty(this.get('model.activation_code'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.settings.entitlement.activeCodeError'));
    }
    this.set('validationWarning', validationString);
    return Ember.isEmpty(this.get('validationWarning')) ? false : true;
  },

  actions: {
    clickInputIcon() {
      this.set('showIcon', false);
    },

    setLicenseToken(licenseToken) {
      this.set('showIcon', true);
      if (Ember.isEmpty(this.get('licenseToken').trim())) {
        this.get('notifications').warning(get(this, 'intl').t('stackPage.admin.settings.entitlement.emptyActiveCode'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-warning'
        });
      } else {
        this.set("model.activation_code", licenseToken);
      }
    },

    focusOut() {
      this.set('showIcon', true);
    },

    activate: function() {
      this.set('showSpinner', true);
      if (!this.validation()) {
        this.get('userStore').rawRequest(this.rawRequestOpts({
          url: '/api/v1/activate',
          method: 'POST',
          data: this.get('model'),
        })).then((xhr) => {
          this.set('modelSpinner', true);
          this.set('showSpinner', false);
        }).catch((err) => {
          this.set('showSpinner', false);
          this.set('modelSpinner', false);
        });
      } else {
        this.set('showSpinner', false);
        this.get('notifications').warning(Ember.String.htmlSafe(this.get('validationWarning')), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-warning'
        });
      }
    },
  }
});
