import DefaultHeaders from 'nilavu/mixins/default-headers';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend(DefaultHeaders, {

  access:    service(),
  session:   service(),
  intl:      service(),
  userStore: service('user-store'),

  model() {
    return hash({
      storageConnectors: this.get('store').findAll('storage', this.opts('storageconnectors', true)),
      storagesPool:      this.get('store').findAll('storagepool', this.opts('storagespool', true)),
      datacenters:       this.get('store').findAll('datacenter', this.opts('datacenters', true)),
      networks:          this.get('store').findAll('network', this.opts('networks', true)),
      nodes:             this.get('store').findAll('node', this.opts('nodes')),
      license:           this.get('store').findAll('license', this.opts('licenses', true)),
      senseis:           this.get('store').findAll('sensei', this.opts('senseis')),
      logs:              this.get('store').findAll('log', this.opts('logs')),
    });
  },
  actions: {
    // This will reload after edit processed by component
    reloadModel() {
      var self = this;

      self.controller.set('modelSpinner', true);
      this.model().then((res) => {
        self.controller.set('model', res);
        self.controller.set('modelSpinner', false);
      });
    }
  }

});
