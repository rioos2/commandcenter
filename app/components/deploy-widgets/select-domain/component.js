import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';
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

  bitsInKey: computed('settings', function() {
    return get(this, 'settings')[denormalizeName(`${ C.SETTING.SECRET_KEY_LENGTH }`)] || D.VPS.bitsInKey;
  }),

  secretTypes: computed('settings', function() {
    let secret = [];

    this.validateSecretTypes().split(',').map((chr) => {
      secret.push(chr);
    });

    return secret;
  }),

  actions: {
    getSecretType(type) {
      set(this, 'secretType', type);
      this.toggleProperty('activate');
    },

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

    createSecret() {
      if (!this.checkDomain() && !this.checkSecrectType()) {
        set(this, 'showSpinner', true);
        set(this, 'secret.secret_type', get(this, 'secretType'));
        set(this, 'secret.data.ssh_keypair_size', get(this, 'bitsInKey'));
        set(this, 'secretObjectMeta', ObjectMetaBuilder.buildObjectMeta());
        set(this, 'secretObjectMeta.name', get(this, 'stacksfactoryObjectMeta.name'));

        var id = get(this, 'session').get('id');

        set(this, 'secretObjectMeta.account', id);
        var url = 'secrets';

        get(this, 'secret').save(this.opts(url)).then((result) => {
          set(this, 'doneCreate', true);
          set(this, 'stacksfactory.secret.id', result.id);
          get(this, 'notifications').info(get(this, 'intl').t('launcherPage.domain.keyGenerate.success'), {
            autoClear:     true,
            clearDuration: 4200,
            cssClasses:    'notification-success'
          });
          set(this, 'showSpinner', false);
        }).catch(() => {
          get(this, 'notifications').warning(get(this, 'intl').t('launcherPage.domain.keyGenerate.failure'), {
            autoClear:     true,
            clearDuration: 4200,
            cssClasses:    'notification-warning'
          });
        });
      } else {
        set(this, 'showSpinner', false);
        get(this, 'notifications').warning(get(this, 'errorMsg'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      }
    },
  },
  validateSecretTypes() {
    return get(this, 'settings')[denormalizeName(`${ C.SETTING.SECRET_TYPE_NAMES }`)] || D.VPS.secretTypes;
  },

  checkDomain() {
    let checkDomain =  isEmpty(get(this, 'stacksfactoryObjectMeta.name'));

    if (checkDomain) {
      set(this, 'errorMsg', get(this, 'intl').t('launcherPage.domain.keyGenerate.emptyDomain'));
    }

    return checkDomain;
  },

  checkSecrectType() {
    let checkSecrectType =  isEmpty(get(this, 'secretType'));

    if (checkSecrectType) {
      set(this, 'errorMsg', get(this, 'intl').t('launcherPage.domain.keyGenerate.emptySecretType'));
    }

    return checkSecrectType;
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
