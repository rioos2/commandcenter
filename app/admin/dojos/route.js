import DefaultHeaders from 'nilavu/mixins/default-headers';
import HashSettledFilter from 'nilavu/mixins/hash-settled-filter';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hashSettled } from 'rsvp';

export default Route.extend(DefaultHeaders, HashSettledFilter, {

  access:         service(),
  userStore:      service('user-store'),

  model() {
    return hashSettled({
      storageConnectors: this.get('store').findAll('storage', this.opts('storageconnectors', true)),
      storagesPool:      this.get('store').findAll('storagepool', this.opts('storagespool', true)),
      datacenters:       this.get('store').findAll('datacenter', this.opts('datacenters', true)),
      networks:          this.get('store').findAll('network', this.opts('networks', true)),
      nodes:             this.get('store').findAll('node', this.opts('nodes')),
      license:           this.get('store').findAll('license', this.opts('licenses', true)),
      senseis:           this.get('store').findAll('sensei', this.opts('senseis')),
      logs:              this.get('store').find('log', null, this.opts('logs')),
      audits:            this.get('store').find('audit', null, this.opts('audits')),
      accounts:          this.get('store').find('account', null, this.opts('accounts')),
      alertRules:        this.get('store').findAll('alertrule', this.opts('alertrules')),
      alertBuiltinRules: this.get('store').findAll('alertBuiltinRule', this.opts('alertbuiltinrules')),
    }).then((hash) => {
      return this.responseHandler(hash);
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