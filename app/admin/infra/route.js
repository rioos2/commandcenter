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
        storageConnectors: this.get('store').findAll('storageconnectors',this.opts('storageconnectors')),
        storagesPool: this.get('store').findAll('storagespools',this.opts('storagespool')),
        datacenters: this.get('store').findAll('datacenters',this.opts('datacenters')),
        networks: this.get('store').findAll('networks',this.opts('networks')),
        nodes: this.get('store').findAll('node',this.opts('nodes')),
      });
  },

  actions: {
    reload: function() {
      var self = this;
      self.controller.set('modelSpinner', true);
      this.model().then(function(res) {
        self.controller.set('model', res);
        self.controller.set('modelSpinner', false);
      });
    }
  }

});
