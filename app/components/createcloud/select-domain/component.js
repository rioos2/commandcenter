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
    newDomainName: "",
    activate: false,
    showSpinner: false,

    domainPlaceHolder: function() {
      return get(this, 'intl').t('launcherPage.domain.domainPlaceHolder');
    }.property('domainPlaceHolder'),


    validateDomain: function () {
      return this.get('model.settings')[denormalizeName(`${C.SETTING.DOMAIN}`)] || D.VPS.domain;
    }.property('model.settings'),


    validateSecretTypes: function () {
      return this.get('model.settings')[denormalizeName(`${C.SETTING.SECRET_TYPE_NAMES}`)] || D.VPS.secretTypes;
    },

    bitsInKey: function () {
      return this.get('model.settings')[denormalizeName(`${C.SETTING.SECRET_KEY_LENGTH}`)] || D.VPS.bitsInKey;
    }.property('model.settings'),

    secretTypes: function () {
      let secret = [];
      this.validateSecretTypes().split(',').map(function (chr) {
        secret.push(chr);
      });
      return secret;
    }.property('model.settings'),

    checkDomain() {
      let checkDomain =  Ember.isEmpty(this.get('model.assemblyfactory.object_meta.name'));
      if (checkDomain) {
        this.set('errorMsg', get(this, 'intl').t('launcherPage.domain.keyGenerate.emptyDomain'));
      }
      return checkDomain;
    },

    checkSecrectType() {
      let checkSecrectType =  Ember.isEmpty(this.get('secretType'));
      if (checkSecrectType) {
        this.set('errorMsg', get(this, 'intl').t('launcherPage.domain.keyGenerate.emptySecretType'));
      }
      return checkSecrectType;
    },

    actions: {
        getSecretType: function (type) {
            this.set("secretType", type);
            this.toggleProperty('activate');
        },

        clickInputIcon() {
            this.set('showIcon', false);
        },

        setNewDomain(newDomainName) {
            this.set('showIcon', true);
            if(Ember.isEmpty(this.get('newDomainName').trim())) {
              this.get('notifications').warning(get(this, 'intl').t('launcherPage.domain.emptyDomain'), {
                autoClear: true,
                clearDuration: 4200,
                cssClasses: 'notification-warning'
              });
            } else {
              this.set("model.assemblyfactory.object_meta.name", (this.get('newDomainName') + this.get('validateDomain')).replace(/\s/g, ''));
            }
        },

        focusOut() {
            this.set('showIcon', true);
        },

        createSecret() {
          var self = this;
          if (!this.checkDomain() && !this.checkSecrectType()) {
            this.set('showSpinner', true);
            this.sendAction('done', "step2");
            this.set("model.secret.data.ssh-algorithm", this.get("secretType"));
            this.set("model.secret.data.ssh_keypair_size", this.get("bitsInKey"));
            this.set('model.secret.object_meta', ObjectMetaBuilder.buildObjectMeta());
            this.set("model.secret.object_meta.name", this.get("model.assemblyfactory.object_meta.name"));

            var session = this.get("session");
            var id = this.get("session").get("id");
            this.set("model.secret.object_meta.account", id);
            var url = 'accounts/' + id + '/secrets';
            // var url = 'secrets';
            this.get('model.secret').save(this.opts(url)).then((result) => {
              this.set('doneCreate', true);
              this.set("model.assemblyfactory.secret.id", result.id);
              this.get('notifications').info(get(this, 'intl').t('launcherPage.domain.keyGenerate.success'), {
                autoClear: true,
                clearDuration: 4200,
                cssClasses: 'notification-success'
              });
              this.set('showSpinner', false);
            }).catch(err => {
              this.get('notifications').warning(get(this, 'intl').t('launcherPage.domain.keyGenerate.failure'), {
                autoClear: true,
                clearDuration: 4200,
                cssClasses: 'notification-warning'
              });
            });
          } else {
            this.set('showSpinner', false);
            this.get('notifications').warning(this.get('errorMsg'), {
              autoClear: true,
              clearDuration: 4200,
              cssClasses: 'notification-warning'
            });
          }
        },
    }
});
