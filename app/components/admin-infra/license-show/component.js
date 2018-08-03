import Component from '@ember/component';
import DefaultHeaders from 'nilavu/mixins/default-headers';
const { get } = Ember;

import C from 'nilavu/utils/constants';

export default Component.extend(DefaultHeaders, {
  intl:                  Ember.inject.service(),
  session:               Ember.inject.service(),
  notifications:         Ember.inject.service('notification-messages'),
  showActivationEditBox: true,
  showSpinner:           false,

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

  licenceid: function() {
    return get(this, 'intl').t('stackPage.admin.settings.entitlement.licenceid');
  }.property('licenceid'),

  licencepassword: function() {
    return get(this, 'intl').t('stackPage.admin.settings.entitlement.licencepassword');
  }.property('licencepassword'),

  status: function() {
    return this.get('model.status').capitalize();
  }.property('model.status'),

  expired: function(){
    return Ember.isEqual(this.get('model.status').capitalize(), C.NODE.LICENSE_STATUS )? "": get(this, 'intl').t('stackPage.admin.settings.entitlement.expired') + this.get('model.expired_at') + get(this, 'intl').t('stackPage.admin.settings.entitlement.days');
  }.property('model.status','model.expired_at'),

  activate: function() {
    this.set('showSpinner', true);
      var url = 'licenses/activate';
      this.get('store').rawRequest(this.rawRequestOpts({
        url: '/api/v1/licenses/activate',
        method: 'POST',
        data: JSON.stringify(this.get('model')),
      })).then((xhr) => {
      this.get('notifications').info(get(this, 'intl').t('stackPage.admin.settings.entitlement.activation.success'), {
        autoClear: true,
        clearDuration: 4200,
        cssClasses: 'notification-success'
      });
        this.set('showActivationEditBox', true);
        this.set('modelSpinner', true);
        this.set('showSpinner', false);
        this.sendAction('doReload');
    }).catch((err) => {
      this.get('notifications').warning(get(this, 'intl').t('stackPage.admin.settings.entitlement.activation.failure'), {
        autoClear: true,
        clearDuration: 4200,
        cssClasses: 'notification-warning'
      });
      this.set('showSpinner', false);
      this.set('modelSpinner', false);
    });
  },

  btnName: function(){
    return get(this, 'intl').t('stackPage.admin.header.activate_btn');
  }.property(),

  actions: {

    performActivation: function(licenceid, licencepassword) {
      if (Ember.isEmpty(licenceid.trim()) || Ember.isEmpty(licencepassword.trim()))  {
        this.get('notifications').warning(get(this, 'intl').t('stackPage.admin.settings.entitlement.emptyActiveCode'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
        this.set('showActivationEditBox', true);
      } else {
        this.set("model.license_id", licenceid);
        this.set("model.password", licencepassword);
        this.set("model.activation_completed", true);
        this.set("model.product", C.WIZARD.ACTIVATION.PRODUCT);
        this.set("model.status", C.WIZARD.ACTIVATION.STATUS.ACTIVATING);
        this.activate();
      }
    },

  },
  activate() {
    this.set('showSpinner', true);
    var url = 'license/activate';

    this.get('model').save(this.opts(url)).then(() => {
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
