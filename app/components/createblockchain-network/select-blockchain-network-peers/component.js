import Component from '@ember/component';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import C from 'nilavu/utils/constants';
import D from 'nilavu/utils/default';
import { get } from '@ember/object';
import { denormalizeName } from 'nilavu/utils/denormalize';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Component.extend(DefaultHeaders, {
  intl:              service(),
  session:           service(),
  notifications:     service('notification-messages'),
  showDomainEditBox: true,
  activate:          false,
  showSpinner:       false,

  btnName: function(){
    return get(this, 'intl').t('launcherPage.domain.buttonSet');
  }.property(),

  domainPlaceHolder: function() {
    return get(this, 'intl').t('launcherPage.domain.domainPlaceHolder');
  }.property('domainPlaceHolder'),

  resource: function(){
    return {
      name:        'peer',
      title:       get(this, 'intl').t('launcherPage.sysConfig.peerChooser.title'),
      description: get(this, 'intl').t('launcherPage.sysConfig.peerChooser.description'),
    };
  }.property(),


  validateDomain: function() {
    return this.get('model.settings')[denormalizeName(`${ C.SETTING.DOMAIN }`)] || D.VPS.domain;
  }.property('model.settings'),


  actions: {
    setNewDomain(newDomainName) {
      this.set('showDomainEditBox', true);
      if (isEmpty(newDomainName.trim())) {
        this.get('notifications').warning(get(this, 'intl').t('launcherPage.domain.emptyDomain'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      } else {
        this.set('model.stacksfactory.object_meta.name', this.nameSpliter(newDomainName));
      }
    },

  },
  checkDomain() {
    let checkDomain =  isEmpty(this.get('model.stacksfactory.object_meta.name'));

    if (checkDomain) {
      this.set('errorMsg', get(this, 'intl').t('launcherPage.domain.keyGenerate.emptyDomain'));
    }

    return checkDomain;
  },

  nameSpliter(newDomainName) {
    return (`${ newDomainName  }-${  this.get('model.stacksfactory.object_meta.name').split('-').get('lastObject') }`).replace(/\s/g, '')
  },

});
