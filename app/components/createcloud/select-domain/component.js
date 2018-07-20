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
    showDomainEditBox: true,
    activate: false,
    showSpinner: false,

    domainPlaceHolder: function() {
      return get(this, 'intl').t('launcherPage.domain.domainPlaceHolder');
    }.property('domainPlaceHolder'),

    btnName: function(){
      return get(this, 'intl').t('launcherPage.domain.buttonSet');
    }.property(),

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
      let checkDomain =  Ember.isEmpty(this.get('model.stacksfactory.object_meta.name'));
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

    nameSpliter(newDomainName) {
      var count=0;
          if (!newDomainName.match(/^[a-zA-Z0-9-]+$/i))
          {
            count++;
          }
      if(count != 1){
        return (newDomainName + "-" + this.get('model.stacksfactory.object_meta.name').split("-").get('lastObject')).replace(/\s/g, '')
      }
      else {
      //  alert("Enter the alphanumeric values only");
      this.get('notifications').warning(get(this, 'intl').t('launcherPage.domain.domainWithoutSymbol'), {
        autoClear: true,
        clearDuration: 4200,
        cssClasses: 'notification-warning'
      });
       return this.get('model.stacksfactory.object_meta.name');
      }
    },

    actions: {
        getSecretType: function (type) {
            this.set("secretType", type);
            this.toggleProperty('activate');
        },

        setNewDomain(newDomainName) {
            this.set('showDomainEditBox', true);
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

        createSecret() {
          var self = this;
          if (!this.checkDomain() && !this.checkSecrectType()) {
            this.set('showSpinner', true);
            this.sendAction('done', "step2");
            this.set("model.secret.data.ssh-algorithm", this.get("secretType"));
            this.set("model.secret.data.ssh_keypair_size", this.get("bitsInKey"));
            this.set('model.secret.object_meta', ObjectMetaBuilder.buildObjectMeta());
            this.set("model.secret.object_meta.name", this.get("model.stacksfactory.object_meta.name"));

            var session = this.get("session");
            var id = this.get("session").get("id");
            this.set("model.secret.object_meta.account", id);
            var url = 'accounts/' + id + '/secrets';
            // var url = 'secrets';
            this.get('model.secret').save(this.opts(url)).then((result) => {
              this.set('doneCreate', true);
              this.set("model.stacksfactory.secret.id", result.id);
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
