import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import C from 'nilavu/utils/constants';
import D from 'nilavu/utils/default';
import { denormalizeName } from 'nilavu/utils/denormalize';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import {
  get, set, computed
} from '@ember/object';


export default Component.extend(DefaultHeaders, {
  intl:                    service(),
  session:                 service(),
  notifications:           service('notification-messages'),
  showDomainEditBox:       true,
  activate:                false,
  showSpinner:             false,
  stacksfactoryObjectMeta: alias('stacksfactory.object_meta'),
  secretObjectMeta:        alias('secret.object_meta'),

  domainPlaceHolder: computed('domainPlaceHolder', function() {
    return get(this, 'intl').t('launcherPage.domain.select.placeholder');
  }),

  validateDomain: computed('settings', function() {
    return get(this, 'settings')[denormalizeName(`${ C.SETTING.DOMAIN }`)] || D.VPS.domain;
  }),

  actions: {

    setNewDomain(newDomainName) {
      set(this, 'showDomainEditBox', true);
      if (isEmpty(newDomainName.trim())) {
        get(this, 'notifications').warning(get(this, 'intl').t('validation.domain.required'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      } else {
        set(this, 'stacksfactoryObjectMeta.name', this.nameSpliter(newDomainName));
      }
    },
  },

  nameSpliter(newDomainName) {
    if (newDomainName.match(/^[a-zA-Z0-9-]+$/i)) {
      return (`${ newDomainName  }-${  get(this, 'stacksfactoryObjectMeta.name').split('-').get('lastObject') }`).replace(/\s/g, '')
    } else {
      get(this, 'notifications').warning(get(this, 'intl').t('launcherPage.domain.domainWithoutSymbol'), {
        autoClear:     true,
        clearDuration: 4200,
        cssClasses:    'notification-warning'
      });

      return get(this, 'stacksfactoryObjectMeta.name');
    }
  },

});
