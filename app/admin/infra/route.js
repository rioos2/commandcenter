import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import {
  xhrConcur
} from 'nilavu/utils/platform';
const { get} = Ember;


export default Ember.Route.extend(DefaultHeaders, {

  access: Ember.inject.service(),
  session: Ember.inject.service(),
  intl:       Ember.inject.service(),
  userStore: Ember.inject.service('user-store'),

  model(params) {
      return Ember.RSVP.hash({
        storageConnectors: this.get('store').findAll('storage',this.opts('storageconnectors', true)),
        storagesPool: this.get('store').findAll('storagepool',this.opts('storagespool', true)),
        datacenters: this.get('store').findAll('datacenter',this.opts('datacenters', true)),
        networks: this.get('store').findAll('network',this.opts('networks', true)),
        nodes: this.get('store').findAll('node',this.opts('nodes')),
        license: this.loadLicense(),
      });
  },

  loadLicense() {
    var licenseData = {
          id: "876545676543456",
          type: 'license',
          name: 'SoftwareKey',
          product: 'Rioos',
          activation_code: "",
          trial: true,
          status: "Expired",
          type_meta: {
            kind: "License",
            version: "v1"
          }
    };

    return this.get('store').createRecord(licenseData);
  },



  actions: {
    //This will reload after edit processed by component
    reloadModel: function() {
      var self = this;
      self.controller.set('modelSpinner', true);
      this.model().then(function(res) {
        self.controller.set('model', res);
        self.controller.set('modelSpinner', false);
      });
    }
  }

});
