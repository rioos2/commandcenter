import Component from '@ember/component';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import { get } from '@ember/object';
import { isEqual, isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import C from 'nilavu/utils/constants';

export default Component.extend(DefaultHeaders, {

  intl: service(),

  session: service(),

  notifications: service('notification-messages'),

  showActivationEditBox: true,

  showSpinner: false,

  ninjaActivated: function(){
    return this.get('model.activation.remain');
  }.property('model.activation.remain'),

  ninjaAllowed: function(){
    return this.get('model.activation.limit');
  }.property('model.activation.limit'),

  senseiActivated: function(){
    return this.get('model.activation.remain');
  }.property('model.activation.remain'),

  senseiAllowed: function(){
    return this.get('model.activation.limit');
  }.property('model.activation.limit'),

  product: function(){
    return this.get('model.product');
  }.property('model.product'),

  optionName: function(){
    return this.get('model.object_meta.name').capitalize();
  }.property('model.object_meta.name'),

  licenseId: function() {
    return get(this, 'intl').t('stackPage.admin.settings.entitlement.licenseId');
  }.property('licenseId'),

  licensePassword: function() {
    return get(this, 'intl').t('stackPage.admin.settings.entitlement.licensePassword');
  }.property('licensePassword'),

  status: function() {
    return this.get('model.status').capitalize();
  }.property('model.status'),

  expired: function(){
    return isEqual(get(this, 'model.status').capitalize(), C.NODE.LICENSE_STATUS ) ?  '' :  get(this, 'intl').t('stackPage.admin.settings.entitlement.expired') + get(this, 'model.expired_at') + get(this, 'intl').t('stackPage.admin.settings.entitlement.days');
  }.property('model.status', 'model.expired_at'),

  btnName: function(){
    return get(this, 'intl').t('stackPage.admin.header.activate_btn');
  }.property(),


  actions: {

    performActivation(licenseId, licensePassword) {
      if (isEmpty(licenseId.trim()) || isEmpty(licensePassword.trim()))  {
        this.get('notifications').warning(get(this, 'intl').t('stackPage.admin.settings.entitlement.emptyActiveCode'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
        this.set('showActivationEditBox', true);
      } else {
        this.set('model.license_id', licenseId);
        this.set('model.password', licensePassword);
        this.set('model.activation_completed', true);
        this.set('model.product', C.WIZARD.ACTIVATION.PRODUCT);
        this.set('model.status', C.WIZARD.ACTIVATION.STATUS.ACTIVATING);
        this.activate();
      }
    },

  },

  activate() {
    this.set('showSpinner', true);
    this.get('store').rawRequest(this.rawRequestOpts({
      url:     '/api/v1/licenses/activate',
      method:  'POST',
      data:    JSON.stringify(this.get('model')),
    })).then((xhr) => {
      this.get('notifications').info(get(this, 'intl').t('stackPage.admin.settings.entitlement.activation.success'), {
        autoClear:      true,
        clearDuration:  4200,
        cssClasses:     'notification-success'
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
