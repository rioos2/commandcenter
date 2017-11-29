/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';
import DefaultVps from 'nilavu/models/default-vps';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';
import SelfCert from 'npm:self-cert';


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
    this.set("model.assemblyfactory.properties.domain", this.get('domain'));
    this.set("model.assemblyfactory.name", this.get('domain'));
    this.sendAction('done', "step2");

  }),

  updateName: function() {
    this.sendAction('done', "step2");
    this.set("model.assemblyfactory.properties.domain", this.get('domain'));
    this.set("model.assemblyfactory.name", this.get('domain'));
  }.observes('domain'),

  actions: {
    createDomain: function() {
      this.toggleProperty('showEdit');
    },

    getSecretType: function(type) {
      this.set("secretType", type);
      this.toggleProperty('activate');
    },

    createSecret() {
      this.set('showSpinner', true);
      this.sendAction('done', "step2");
      this.set("model.secret.secret_type", this.get("secretType"));
      //Signed operations
      let certDetails = SelfCert({
        attrs: {
          orgName: 'RioCorp',
          shortName: 'rioos'
        },
        bits: this.get('bitsInKey'),
        expires: new Date('2030-12-31')
      });
      this.set("model.secret.data.rsa_pub", certDetails.publicKey);
      this.set("model.secret.data.rsa_key", certDetails.privateKey);
      this.set("model.secret.data.anykey", certDetails.certificate);
      //singned operations end
      var session = this.get("session");
      var origin = this.get("session").get("origin");
      this.set('model.secret.object_meta', ObjectMetaBuilder.buildObjectMeta("", origin));
      var url = 'origins/' + origin +'/secrets';
      this.get('model.secret').save(this.opts(url)).then((result) => {
        this.set("model.assemblyfactory.secret", {id: result.id});
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
