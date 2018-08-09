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



  activated: function(){
    return this.get('model.activation.remain');
  }.property('model.activation.remain'),

  allowed: function(){
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
    return Ember.isEqual(this.get('model.status').capitalize(), C.NODE.LICENSE_STATUS ) ? '' : get(this, 'intl').t('stackPage.admin.settings.entitlement.expired') + this.get('model.expired_at') + get(this, 'intl').t('stackPage.admin.settings.entitlement.days');
  }.property('model.status', 'model.expired_at'),

  btnName: function(){
    return get(this, 'intl').t('stackPage.admin.header.activate_btn');
  }.property(),
});
