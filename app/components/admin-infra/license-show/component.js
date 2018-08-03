import Component from '@ember/component';
import DefaultHeaders from 'nilavu/mixins/default-headers';
const { get} = Ember;
import C from 'nilavu/utils/constants';

export default Component.extend(DefaultHeaders, {
  intl: Ember.inject.service(),
  session: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  showActivationEditBox: true,
  showSpinner: false,

  ninjaActivated: function(){
    return this.get('model.product_options.ninja.current');
  }.property('model.product_options.ninja.current'),

  ninjaAllowed: function(){
    return this.get('model.product_options.ninja.maximum');
  }.property('model.product_options.ninja.maximum'),

  senseiActivated: function(){
    return this.get('model.product_options.sensei.current');
  }.property('model.product_options.sensei.current'),

  senseiAllowed: function(){
    return this.get('model.product_options.sensei.maximum');
  }.property('model.product_options.sensei.maximum'),

  product: function(){
    return this.get('model.product');
  }.property('model.product'),

  placeHolder: function() {
    return get(this, 'intl').t('stackPage.admin.settings.entitlement.activeCode');
  }.property('placeHolder'),

  status: function() {
    return this.get('model.status').capitalize();
  }.property('model.status'),

  expired: function(){
    return Ember.isEqual(this.get('model.status').capitalize(), C.NODE.LICENSE_STATUS.EXPIRED ) ? "": get(this, 'intl').t('stackPage.admin.settings.entitlement.expired') + this.get('model.expired_at') + get(this, 'intl').t('stackPage.admin.settings.entitlement.days');
  }.property('model.status','model.expired_at'),

  activate: function() {
    this.set('showSpinner', true);
      var url = 'license/activate';
    this.get('model').save(this.opts(url)).then(() => {
      this.get('notifications').info(get(this, 'intl').t('stackPage.admin.settings.entitlement.activation.success'), {
        autoClear: true,
        clearDuration: 4200,
        cssClasses: 'notification-success'
      });
        this.set('showActivationEditBox', true);
        this.set('modelSpinner', true);
        this.set('showSpinner', false);
        this.sendAction('doReload');
    }).catch(err => {
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
    return get(this, 'intl').t('stackPage.admin.header.active_btn');
  }.property(),

  actions: {

    performActivation: function(activationCode) {
      if (Ember.isEmpty(activationCode.trim())) {
        this.get('notifications').warning(get(this, 'intl').t('stackPage.admin.settings.entitlement.emptyActiveCode'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-warning'
        });
        this.set('showActivationEditBox', true);
      } else {
        this.set("model.activation_code", activationCode);
        this.activate();
      }
    },

  }
});
