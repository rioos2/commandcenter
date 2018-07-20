import Ember from 'ember';
const {
  get
} = Ember;
import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
export default Ember.Component.extend(DefaultHeaders, {

  tagName: 'section',
  className: '',
  showSpinnerLicense: false,
  showSpinnerTrail: false,

  intl: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  access: Ember.inject.service(),


  useTrailVersionNote: function() {
    return Ember.String.htmlSafe(get(this, 'intl').t('wizard.useTrailVersionNote'));
  }.property('model'),

  licenceIdPlaceholder: function() {
    return get(this, 'intl').t('wizard.licenceIdPlaceholder');
  }.property('model'),

  licencePwdPlaceholder: function() {
    return get(this, 'intl').t('wizard.licencePwdPlaceholder');
  }.property('model'),

  validation() {
    var validationString = "";
    if (Ember.isEmpty(this.get('licenceId'))) {
      validationString = validationString.concat(get(this, 'intl').t('wizard.licenseIDError'));
    }
    if (Ember.isEmpty(this.get('licencePwd'))) {
      validationString = validationString.concat(get(this, 'intl').t('wizard.licensePwdError'));
    }
    this.set('validationWarning', validationString);
    return Ember.isEmpty(this.get('validationWarning')) ? false : true;
  },

  checkLicenseStatus() {
    let self = this;
    Em.run.later(function() {
      console.log(JSON.stringify(self.get('model')));
      console.log(JSON.stringify(self.get('model.license.license.content').get('firstObject')));
      let license = self.get('model.license.license.content').get('firstObject');
      if(license.status === 'active') {
        self.set('showSpinnerLicense', false);
        self.get('notifications').warning(get(self, 'intl').t('wizard.licenseSuccessMsg'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-success'
        });
        location.reload();
      } else {
        self.set('showSpinnerLicense', false);
        self.get('notifications').warning(get(self, 'intl').t('wizard.licenseFailedMsg'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-warning'
        });
      }
    }, 1500);
  },

  checkLicense() {
    let self = this;
    Em.run.later(function() {
      self.sendAction('reloadModel');
      self.checkLicenseStatus();
    }, 1500);
  },

  actions: {

    processTrail: function() {
      this.set('showSpinnerTrail', true);
      let license = this.get('model.license.license.content').get('firstObject');
      license.activation_completed = true;
      license.product = C.WIZARD.ACTIVATION.PRODUCT;
      this.get('store').rawRequest(this.rawRequestOpts({
        url: '/api/v1/licenses/activate',
        method: 'POST',
        data: license,
      })).then((xhr) => {
        this.set('showSpinnerTrail', false);
        this.get('notifications').warning(get(this, 'intl').t('wizard.licenseSuccessMsg'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-success'
        });
        location.reload();
      }).catch((err) => {
        this.set('showSpinnerTrail', false);
        this.get('notifications').warning(get(this, 'intl').t('wizard.licenseFailedMsg'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-warning'
        });
      });

    },

    updateLicence: function() {
      this.set('showSpinnerLicense', true);
      if (!this.validation()) {
        let license = this.get('model.license.license.content').get('firstObject');
        license.activation_completed = true;
        license.product = C.WIZARD.ACTIVATION.PRODUCT;
        license.license_id = this.get('licenceId');
        license.password = this.get('licencePwd');
        license.status = C.WIZARD.ACTIVATION.STATUS.ACTIVATING;
        this.get('store').rawRequest(this.rawRequestOpts({
          url: '/api/v1/licenses/activate',
          method: 'POST',
          data: license,
        })).then((xhr) => {
          this.checkLicense();
        }).catch((err) => {
          this.set('showSpinnerLicense', false);
          this.get('notifications').warning(get(this, 'intl').t('wizard.licenseFailedMsg'), {
            autoClear: true,
            clearDuration: 4200,
            cssClasses: 'notification-warning'
          });
        });
      } else {
        this.set('showSpinnerLicense', false);
        this.get('notifications').warning(Ember.String.htmlSafe(this.get('validationWarning')), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-warning'
        });
      }
    },
  },

});
