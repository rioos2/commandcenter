import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';
import Config from 'nilavu/mixins/config';
import C from 'nilavu/utils/constants';
export function denormalizeName(str) {
  return str.replace(new RegExp('['+C.SETTING.DOT_CHAR+']','g'),'.').toLowerCase();
}

export default Ember.Component.extend(DefaultHeaders,Config, {

      activate: false,
      session: Ember.inject.service(),
      notifications: Ember.inject.service('notification-messages'),
      doneCreate: false,

      updateName: function() {

        if (!this.checkDomain()) {
          this.set("model.assemblyfactory.name", (this.get('domain') + this.validateDomain()).replace(/\s/g, ''));
          this.set("model.assemblyfactory.object_meta.name", this.get("model.assemblyfactory.name"));
        } else {
          this.set("model.assemblyfactory.name",'');
          this.set("model.assemblyfactory.object_meta.name", '');
          }
        }.observes('domain'),

        validateDomain: function () {
          alert("domain");
          return this.get('model.settings')[denormalizeName(`${C.SETTING.DOMAIN}`)] || this.defaultVPS().domain;
        },

        validateSecretTypes: function () {
          return this.get('model.settings')[denormalizeName(`${C.SETTING.SECRET_TYPE_NAMES}`)] || this.defaultVPS().secretTypes;
        },

        bitsInKey: function () {
          alert("bitinkey");
          return this.get('model.settings')[denormalizeName(`${C.SETTING.SECRET_KEY_LENGTH}`)] || this.defaultVPS().bitsInKey;
        },

        secretTypes:function(){
          let secret=[];
          this.validateSecretTypes().split(',').map(function(chr) {
            secret.push(chr);
          });
          return secret;
        }.property('model.settings.secretTypes'),


          checkDomain() {
            return Ember.isEmpty(this.get('domain'));
          },

          actions: {

            getSecretType: function(type) {
              this.set("secretType", type);
              this.toggleProperty('activate');
            },

            createSecret() {
              if (!this.checkDomain()) {
                this.set('showSpinner', true);
                this.sendAction('done', "step2");
                this.set("model.secret.data.ssh-algorithm", this.get("secretType"));
                this.set("model.secret.data.ssh_keypair_size", this.get("bitsInKey"));
                this.set('model.secret.object_meta', ObjectMetaBuilder.buildObjectMeta());
                this.set("model.secret.object_meta.name", this.get("model.assemblyfactory.name"));
                var session = this.get("session");
                var id = this.get("session").get("id");
                this.set("model.secret.object_meta.account", id);
                var url = 'accounts/' + id + '/secrets';
                // var url = 'secrets';
                this.get('model.secret').save(this.opts(url)).then((result) => {
                  this.set('doneCreate', true);
                  this.set("model.assemblyfactory.secret.id", result.id);
                  this.get('notifications').info('Secret key generated successfully.', {
                    autoClear: true,
                    clearDuration: 4200,
                    cssClasses:'notification-success'
                  });
                  this.set('showSpinner', false);
                }).catch(err => {
                  this.get('notifications').warning('Secret key generated failed.', {
                    autoClear: true,
                    clearDuration: 4200,
                    cssClasses:'notification-warning'
                  });
                  this.set('showSpinner', false);
                });
              } else {
                this.get('notifications').warning('Please enter domain name.', {
                  autoClear: true,
                  clearDuration: 4200,
                  cssClasses:'notification-warning'
                });
              }
            },
          }
      });
