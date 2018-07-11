import Component from '@ember/component';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';
import C from 'nilavu/utils/constants';
import D from 'nilavu/utils/default';
const { get } = Ember;
import { denormalizeName } from 'nilavu/utils/denormalize';


export default Component.extend(DefaultHeaders, {
    intl: Ember.inject.service(),
    session: Ember.inject.service(),
    notifications: Ember.inject.service('notification-messages'),
    showIcon: true,
    activate: false,
    showSpinner: false,

    btnName: function(){
      return get(this, 'intl').t('launcherPage.domain.buttonSet');
    }.property(),

    domainPlaceHolder: function() {
      return get(this, 'intl').t('launcherPage.domain.domainPlaceHolder');
    }.property('domainPlaceHolder'),


    validateDomain: function () {
      return this.get('model.settings')[denormalizeName(`${C.SETTING.DOMAIN}`)] || D.VPS.domain;
    }.property('model.settings'),


    checkDomain() {
      let checkDomain =  Ember.isEmpty(this.get('model.stacksfactory.object_meta.name'));
      if (checkDomain) {
        this.set('errorMsg', get(this, 'intl').t('launcherPage.domain.keyGenerate.emptyDomain'));
      }
      return checkDomain;
    },

    nameSpliter(newDomainName) {
      return (newDomainName + "-" + this.get('model.stacksfactory.object_meta.name').split("-").get('lastObject')).replace(/\s/g, '')
    },

    actions: {
        setNewDomain(newDomainName) {
            this.set('showIcon', true);
            if(Ember.isEmpty(newDomainName.trim())) {
              this.get('notifications').warning(get(this, 'intl').t('launcherPage.domain.emptyDomain'), {
                autoClear: true,
                clearDuration: 4200,
                cssClasses: 'notification-warning'
              });
            } else {
              this.set("model.stacksfactory.object_meta.name", this.nameSpliter(newDomainName));
            }
        },

    }
});
