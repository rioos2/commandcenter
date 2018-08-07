import Component from '@ember/component';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';
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

  domainPlaceHolder: function() {
    return get(this, 'intl').t('launcherPage.domain.domainPlaceHolder');
  }.property('domainPlaceHolder'),

  btnName: function(){
    return get(this, 'intl').t('launcherPage.domain.buttonSet');
  }.property(),

  validateDomain: function() {
    return this.get('model.settings')[denormalizeName(`${ C.SETTING.DOMAIN }`)] || D.VPS.domain;
  }.property('model.settings'),


  bitsInKey: function() {
    return this.get('model.settings')[denormalizeName(`${ C.SETTING.SECRET_KEY_LENGTH }`)] || D.VPS.bitsInKey;
  }.property('model.settings'),

  secretTypes: function() {
    let secret = [];

    this.validateSecretTypes().split(',').map((chr) => {
      secret.push(chr);
    });

    return secret;
  }.property('model.settings'),

  actions: {
    getSecretType(type) {
      this.set('secretType', type);
      this.toggleProperty('activate');
    },

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

    createSecret() {
      // var self = this;

      if (!this.checkDomain() && !this.checkSecrectType()) {
        this.set('showSpinner', true);
        this.sendAction('done', 'step2');
        this.set('model.secret.data.ssh-algorithm', this.get('secretType'));
        this.set('model.secret.data.ssh_keypair_size', this.get('bitsInKey'));
        this.set('model.secret.object_meta', ObjectMetaBuilder.buildObjectMeta());
        this.set('model.secret.object_meta.name', this.get('model.stacksfactory.object_meta.name'));

        // var session = this.get('session');
        var id = this.get('session').get('id');

        this.set('model.secret.object_meta.account', id);
        var url = 'secrets';

        this.get('model.secret').save(this.opts(url)).then((result) => {
          this.set('doneCreate', true);
          this.set('model.stacksfactory.secret.id', result.id);
          this.get('notifications').info(get(this, 'intl').t('launcherPage.domain.keyGenerate.success'), {
            autoClear:     true,
            clearDuration: 4200,
            cssClasses:    'notification-success'
          });
          this.set('showSpinner', false);
        }).catch(() => {
          this.get('notifications').warning(get(this, 'intl').t('launcherPage.domain.keyGenerate.failure'), {
            autoClear:     true,
            clearDuration: 4200,
            cssClasses:    'notification-warning'
          });
        });
      } else {
        this.set('showSpinner', false);
        this.get('notifications').warning(this.get('errorMsg'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      }
    },
  },
  validateSecretTypes() {
    return this.get('model.settings')[denormalizeName(`${ C.SETTING.SECRET_TYPE_NAMES }`)] || D.VPS.secretTypes;
  },

  checkDomain() {
    let checkDomain =  isEmpty(this.get('model.stacksfactory.object_meta.name'));

    if (checkDomain) {
      this.set('errorMsg', get(this, 'intl').t('launcherPage.domain.keyGenerate.emptyDomain'));
    }

    return checkDomain;
  },

  checkSecrectType() {
    let checkSecrectType =  isEmpty(this.get('secretType'));

    if (checkSecrectType) {
      this.set('errorMsg', get(this, 'intl').t('launcherPage.domain.keyGenerate.emptySecretType'));
    }

    return checkSecrectType;
  },

  nameSpliter(newDomainName) {
    if (newDomainName.match(/^[a-zA-Z0-9-]+$/i)) {
      return (`${ newDomainName  }-${  this.get('model.stacksfactory.object_meta.name').split('-').get('lastObject') }`).replace(/\s/g, '')
    } else {
      this.get('notifications').warning(get(this, 'intl').t('launcherPage.domain.domainWithoutSymbol'), {
        autoClear:     true,
        clearDuration: 4200,
        cssClasses:    'notification-warning'
      });

      return this.get('model.stacksfactory.object_meta.name');
    }
  },

});
