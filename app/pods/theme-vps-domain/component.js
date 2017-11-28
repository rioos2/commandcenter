/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';
import DefaultVps from 'nilavu/models/default-vps';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import SelfCert from 'npm:self-cert';


export default Ember.Component.extend(DefaultHeaders, {

  domain: DefaultVps.domain,
  secretTypes: DefaultVps.secretTypes,
  activate: false,
  bitsInKey: DefaultVps.bitsInKey,

  initializeChart: Ember.on('didInsertElement', function() {
    var self = this;
    //default
    this.set("model.assemblyfactory.properties.domain", this.get('domain'));
    this.set("model.assemblyfactory.name", this.get('domain'));

  }),

  updateName: function() {
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

      this.get('model.secret').save(this.opts('origins/rioos/secrets')).then((result) => {
        this.set("model.assemblyfactory.secret", {id: result.id});
        this.set('showSpinner', false);
        }).catch(err => {
          this.set('showSpinner', false);
        });
    },
  }
});
