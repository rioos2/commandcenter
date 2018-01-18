import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';


export default Ember.Component.extend(DefaultHeaders, {

      secretTypes: Ember.computed.alias('model.settings.secretTypes'),
      activate: false,
      bitsInKey: Ember.computed.alias('model.settings.bitsInKey'),
      session: Ember.inject.service(),
      notifications: Ember.inject.service('notification-messages'),
      doneCreate: false,

      updateName: function() {
        if (!this.checkDomain()) {
          this.set("model.assemblyfactory.name", (this.get('domain') + "." + this.get('model.settings.domain')).replace(/\s/g, ''));
          this.set("model.assemblyfactory.object_meta.name", this.get("model.assemblyfactory.name"));
        } else {
          this.set("model.assemblyfactory.name",'');
          this.set("model.assemblyfactory.object_meta.name", '');
          }
        }.observes('domain'),

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
                  this.get('notifications').success('Secret key generated successfully.', {
                    autoClear: true,
                    clearDuration: 5200
                  });
                  this.set('showSpinner', false);
                }).catch(err => {
                  this.get('notifications').error('Secret key generated failed.', {
                    autoClear: true,
                    clearDuration: 4200
                  });
                  this.set('showSpinner', false);
                });
              } else {
                this.get('notifications').warning('Please enter domain name.', {
                  autoClear: true,
                  clearDuration: 4200
                });
              }
            },
          }
      });
