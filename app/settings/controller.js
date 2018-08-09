import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    performActivation(licenceid, licencepassword) {
      if (Ember.isEmpty(licenceid.trim()))  {
        this.get('notifications').warning(get(this, 'intl').t('stackPage.admin.settings.entitlement.licenceid'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
        this.set('showActivationEditBox', true);
      } else if (Ember.isEmpty(licencepassword.trim())) {
        this.get('notifications').warning(get(this, 'intl').t('stackPage.admin.settings.entitlement.licencepassword'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
        this.set('showActivationEditBox', true);

      } else {
        this.set('model.license_id', licenceid);
        this.set('model.password', licencepassword);
        this.set('model.activation_completed', true);
        this.set('model.product', C.WIZARD.ACTIVATION.PRODUCT);
        this.set('model.status', C.WIZARD.ACTIVATION.STATUS.ACTIVATING);
        this.activate();
      }
    },

  },
  activate() {
    this.set('showSpinner', true);
    var url = 'licenses/activate';

    this.get('store').rawRequest(this.rawRequestOpts({
      url:    '/api/v1/licenses/activate',
      method: 'POST',
      data:   JSON.stringify(this.get('model')),
    })).then((xhr) => {
      this.get('notifications').info(get(this, 'intl').t('stackPage.admin.settings.entitlement.activation.success'), {
        autoClear:     true,
        clearDuration: 4200,
        cssClasses:    'notification-success'
      });
      this.set('showActivationEditBox', true);
      this.set('modelSpinner', true);
      this.set('showSpinner', false);
      this.sendAction('doReload');
    }).catch((err) => {
      this.get('notifications').warning(get(this, 'intl').t('stackPage.admin.settings.entitlement.activation.failure'), {
        autoClear:     true,
        clearDuration: 4200,
        cssClasses:    'notification-warning'
      });
      this.set('showSpinner', false);
      this.set('modelSpinner', false);
    });
  },
});
