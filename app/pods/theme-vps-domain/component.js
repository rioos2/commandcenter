/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';
import DefaultVps from 'nilavu/models/default-vps';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';


export default Ember.Component.extend(DefaultHeaders, {

  domain: DefaultVps.domain,
  secretTypes: DefaultVps.secretTypes,
  activate: false,
  bitsInKey: DefaultVps.bitsInKey,
  session: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),

  initializeChart: Ember.on('didInsertElement', function() {
    var self = this;
    //default
    this.set("model.assemblyfactory.name", this.get('domain'));
    this.sendAction('done', "step2");

  }),

  updateName: function() {
    this.sendAction('done', "step2");
    this.set("model.assemblyfactory.name", this.get('domain') + "." + DefaultVps.domain);
    this.set("model.assemblyfactory.object_meta.name", this.get("model.assemblyfactory.name"));
  }.observes('domain'),

  actions: {
    createDomain: function() {
      if (!this.get('showEdit')){
        this.set('domain', " ");
      }
      this.toggleProperty('showEdit');
    },

    getSecretType: function(type) {
      this.set("secretType", type);
      this.toggleProperty('activate');
    },

    createSecret() {
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
        this.set("model.assemblyfactory.secret.id", result.id);
        this.get('notifications').success('Secret key generated successfully.', {
          autoClear: true,
          clearDuration: 5200
        });
        this.set('showSpinner', false);
        }).catch(err => {
          this.get('notifications').error('Secret key generated failed.', {});
          this.set('showSpinner', false);
        });
    },
  }
});
