import Component from '@ember/component';
import DefaultHeaders from 'nilavu/mixins/default-headers';
const { get} = Ember;
import C from 'nilavu/utils/constants';

export default Component.extend(DefaultHeaders, {
  intl: Ember.inject.service(),
  session: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  showIcon: true,
  licenseToken: "",
  showSpinner: false,

  placeHolder: function() {
    return get(this, 'intl').t('stackPage.admin.settings.entitlement.activeCode');
  }.property('placeHolder'),

  status: function() {
    return this.get('model.status').capitalize();
  }.property('model.status'),

  expired: function(){
    return Ember.isEqual(this.get('model.status').capitalize(), C.ADMIN.LICENSE_STATUS.EXPIRED )? "": get(this, 'intl').t('stackPage.admin.settings.entitlement.expired') + this.get('model.expired_at') + get(this, 'intl').t('stackPage.admin.settings.entitlement.days');
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
        this.set('showIcon', true);
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

  actions: {
    clickInputIcon() {
      this.set('showIcon', false);
    },

    setLicenseToken(licenseToken) {
      if (Ember.isEmpty(this.get('licenseToken').trim())) {
        this.get('notifications').warning(get(this, 'intl').t('stackPage.admin.settings.entitlement.emptyActiveCode'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-warning'
        });
        this.set('showIcon', true);
      } else {
        this.set("model.activation_code", licenseToken);
        this.set("model.product", get(this, 'intl').t('stackPage.admin.settings.entitlement.rioProduct'));
        this.activate();
      }
    },

    focusOut() {
      this.set('showIcon', true);
    },

  }
});
