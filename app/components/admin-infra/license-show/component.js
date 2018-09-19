import Component from '@ember/component';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import C from 'nilavu/utils/constants';
import { isEqual } from '@ember/utils';
import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { later } from '@ember/runloop';
import { computed } from '@ember/object';


export default Component.extend(DefaultHeaders, {
  intl:                  service(),
  session:               service(),
  notifications:         service('notification-messages'),
  showActivationEditBox: true,
  showSpinner:           false,

  objectMetaData:        alias('model.object_meta.name'),
  status:                alias('model.status'),
  expiredAt:             alias('model.expired_at'),
  activation:            alias('model.activation'),


  /* This section contains the product name and subproduct details i
     The product name is hardcoded as Rio/OS v2
  */
  product: alias('model.product'),

  // The subproduct names can be
  // 1. Sensei
  // 2. Ninja
  subProductName: computed('objectMetaData', function() {
    const o = get(this, 'objectMetaData');

    if (!isEmpty(o)) {
      return o.toString().capitalize();
    }

    return C.LICENSE.SUBPRODUCT.NONE;
  }),

  /* This section contains the status of activation details */

  statusShow: computed('status', function() {
    const s = get(this, 'status');

    if (!isEmpty(s)) {
      return s.capitalize();
    }

    return C.LICENSE.STATUS.NONE;
  }),

  activated: computed('activation', function(){
    return  get(this, 'activation').no_of_activations_available + get(this, 'intl').t('dojos.settings.entitlement.show.used');
  }),

  allowed: computed('activation', function() {
    return get(this, 'activation').total_number_of_activations + get(this, 'intl').t('dojos.settings.entitlement.show.total')  ;
  }),

  licenseId: computed('activation', function() {
    return get(this, 'intl').t('dojos.settings.entitlement.edit.code.id')  ;
  }),

  licensePassword: computed('activation', function() {
    return  get(this, 'intl').t('dojos.settings.entitlement.edit.code.password')  ;
  }),

  expired: computed('status', 'expiredAt', function(){
    const x = get(this, 'status');

    if (isEqual(x, C.LICENSE.STATUS.EXPIRED)) {
      return C.LICENSE.STATUS.EXPIRED;
    }

    return   get(this, 'intl').t('dojos.settings.entitlement.edit.static1') + get(this, 'expiredAt') + get(this, 'intl').t('dojos.settings.entitlement.edit.static2');


  }),

  actions: {

    performActivation(id, password) {
      if (isEmpty(id.trim()) || isEmpty(password.trim()))  {
        this.get('notifications').warning(get(this, 'intl').t('dojos.settings.entitlement.edit.code.title'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
        this.set('showActivationEditBox', true);
      } else {
        this.set('model.license_id', id);
        this.set('model.password', password);
        this.set('model.activation_completed', true);
        this.set('model.product', C.LICENSE.ACTIVATION.PRODUCT);
        this.set('model.status', C.LICENSE.ACTIVATION.STATUS.ACTIVATING);
        this.activate();
      }
    },
  },
  activate() {
    this.set('showSpinner', true);

    this.get('store').rawRequest(this.rawRequestOpts({
      url:    '/api/v1/licenses/activate',
      method: 'POST',
      data:   JSON.stringify(this.get('model')),
    })).then(() => {
      this.checkLicense();
    }).catch(() => {
      this.get('notifications').warning(get(this, 'intl').t('dojos.settings.entitlement.edit.code.error'), {
        autoClear:     true,
        clearDuration: 4200,
        cssClasses:    'notification-warning'
      });
      this.set('showSpinner', false);
      this.set('showInnerSpinner', false);
    });
  },

  checkLicense() {
    let self = this;

    later(() => {
      self.sendAction('doInnerReload');
      self.checkLicenseStatus();
    }, 1500);
  },

  checkLicenseStatus() {
    let self = this;

    later(() => {
      if (self.get('status') ===  C.LICENSE.STATUS.ACTIVE) {
        self.get('notifications').info(get(this, 'intl').t('dojos.settings.entitlement.edit.code.success'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-success'
        });
        self.set('showActivationEditBox', true);
        self.set('showInnerSpinner', true);
        self.set('showSpinner', false);
      } else {
        self.get('notifications').warning(get(self, 'intl').t('wizard.licenseErrorMsg', { error: self.get('model.error') }), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
        self.set('showActivationEditBox', true);
        self.set('showInnerSpinner', true);
        self.set('showSpinner', false);
      }
    }, 1500);
  },


});
