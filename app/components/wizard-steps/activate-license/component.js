import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { later } from '@ember/runloop';
import { htmlSafe } from '@ember/string';
import Component from '@ember/component';
import { get } from '@ember/object';
import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Component.extend(DefaultHeaders, {

  intl:          service(),
  notifications: service('notification-messages'),
  access:        service(),


  tagName:            'section',
  className:          '',
  showSpinnerLicense: false,
  showSpinnerTrail:   false,

  useTrialVersionNote: function() {
    return htmlSafe(get(this, 'intl').t('wizard.useTrialVersionNote'));
  }.property('model'),

  licenceIdPlaceholder: function() {
    return get(this, 'intl').t('wizard.licenceIdPlaceholder');
  }.property('model'),

  licencePwdPlaceholder: function() {
    return get(this, 'intl').t('wizard.licencePwdPlaceholder');
  }.property('model'),

  actions: {

    processTrail() {
      this.set('showSpinnerTrail', true);
      alert(JSON.stringify(this.get('model')));
      let license = this.get('model.license.license.content').get('firstObject');

      //  console.log(JSON.stringify(license)
      license.activation_completed = true;
      license.product = C.WIZARD.ACTIVATION.PRODUCT;
      this.get('store').rawRequest(this.rawRequestOpts({
        url:    '/api/v1/licenses/activate',
        method: 'POST',
        data:   license,
      })).then(() => {
        this.set('showSpinnerTrail', false);
        this.get('notifications').warning(get(this, 'intl').t('wizard.licenseSuccessMsg'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-success'
        });
        location.reload();
      }).catch(() => {
        this.set('showSpinnerTrail', false);
        this.get('notifications').warning(get(this, 'intl').t('wizard.licenseFailedMsg'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      });

    },

    updateLicence() {
      this.set('showSpinnerLicense', true);
      if (!this.validation()) {
        let license = this.get('model.license.license.content').get('firstObject');

        license.activation_completed = true;
        license.product = C.WIZARD.ACTIVATION.PRODUCT;
        license.license_id = this.get('licenceId');
        license.password = this.get('licencePwd');
        license.status = C.WIZARD.ACTIVATION.STATUS.ACTIVATING;
        this.get('store').rawRequest(this.rawRequestOpts({
          url:    '/api/v1/licenses/activate',
          method: 'POST',
          data:   license,
        })).then(() => {
          this.checkLicense();
        }).catch(() => {
          this.set('showSpinnerLicense', false);
          this.get('notifications').warning(get(this, 'intl').t('wizard.licenseFailedMsg'), {
            autoClear:     true,
            clearDuration: 4200,
            cssClasses:    'notification-warning'
          });
        });
      } else {
        this.set('showSpinnerLicense', false);
        this.get('notifications').warning(htmlSafe(this.get('validationWarning')), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      }
    },
  },

  validation() {
    var validationString = '';

    if (isEmpty(this.get('licenceId'))) {
      validationString = validationString.concat(get(this, 'intl').t('wizard.licenseIDError'));
    }
    if (isEmpty(this.get('licencePwd'))) {
      validationString = validationString.concat(get(this, 'intl').t('wizard.licensePwdError'));
    }
    this.set('validationWarning', validationString);

    return isEmpty(this.get('validationWarning')) ? false : true;
  },

  checkLicenseStatus() {
    let self = this;

    later(() => {
      let license = self.get('model.license.license.content').get('firstObject');

      if (license.status === 'active') {
        self.set('showSpinnerLicense', false);
        self.get('notifications').warning(get(self, 'intl').t('wizard.licenseSuccessMsg'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-success'
        });
        location.reload();
      } else {
        self.set('showSpinnerLicense', false);
        self.get('notifications').warning(get(self, 'intl').t('wizard.licenseFailedMsg'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      }
    }, 1500);
  },

  checkLicense() {
    let self = this;

    later(() => {
      self.sendAction('reloadModel');
      self.checkLicenseStatus();
    }, 1500);
  },

});
