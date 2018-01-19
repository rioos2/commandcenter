import Component from '@ember/component';
import C from 'nilavu/utils/constants';

export default Component.extend({
  classNames: ['container-list'],
  pollInterval: 2000,
  pollTimer: null,
  store: Ember.inject.service(),
  offAssembly: ["Stopped", "Failed"],
  assemblyFactory: Ember.computed.alias('model.spec.assembly_factory'),
  assemblyEndpoint: Ember.computed.alias('model.spec.endpoints'),
  spec: Ember.computed.alias('model.spec'),
  metaData: Ember.computed.alias('model.metadata'),



  region: function() {
    return this.get('assemblyFactory.object_meta.cluster_name');
  }.property('model'),

  name: function() {
    let nameCollection = this.get('model.object_meta.name').split(".");
    if (!Ember.isEmpty(nameCollection)) {
      return nameCollection[0];
    }
  }.property('model'),

  host: function() {
    if (this.get('metaData.rioos_machine_vnc_host')) {
      return this.get('metaData.rioos_machine_vnc_host');
    }
    return ""
  }.property('model'),

  port: function() {
    if (this.get('metaData.rioos_machine_vnc_port')) {
      return this.get('metaData.rioos_machine_vnc_port');
    }
    return ""
  }.property('model'),

  assemblyStatusUpdate: function() {
    this.set('assemblyStatus', this.get('model.status.phase').toLowerCase());
    this.set('assemblyState', this.assemblyStateFinder());
  }.observes('model.status.phase'),

  image: function() {
    return 'ico_' + this.get('assemblyFactory.spec.plan.object_meta.name');
  }.property('model'),

  version: function() {
    return this.get('assemblyFactory.spec.plan.version');
  }.property('model'),

  addressesLength: function() {
    return this.get('assemblyEndpoint.subsets.addresses').length;
  }.property('model'),

  country: function() {
    return "_";
  }.property('model'),

  assemblyStatus: function() {
    return this.get('model.status.phase').toLowerCase();
  }.property('model'),

  assemblyState: function() {
    return this.assemblyStateFinder();
  }.property('model'),

  assemblyStateFinder() {
    var state = C.ASSEMBLY.ASSEMBLYON;
    C.ASSEMBLY.ASSEMBLYOFFPHASES.forEach(phase => {
      if (this.get('model.status.phase') === phase) {
        state = C.ASSEMBLY.ASSEMBLYOFF
      }
    });
    return state;
  },

  ip: function() {
    if (!Ember.isEmpty(this.get('assemblyEndpoint.subsets.addresses'))) {
      return this.get('assemblyEndpoint.subsets.addresses')[0].ip;
    }
    return "Not yet assigned";
  }.property('model'),

  ipType: function() {
    if (!Ember.isEmpty(this.get('assemblyEndpoint.subsets.addresses'))) {
      return this.get('assemblyEndpoint.subsets.addresses')[0].protocol_version;
    }
    return C.ASSEMBLY.ASSEMBLYIPV4;
  }.property('model'),

  metricsData: function() {
    if (!JSON.stringify(this.get('spec.metrics')) === JSON.stringify({})) {
      this.set('spec.metrics.name', "gauge" + this.get('model.id'));
      this.set('model.spec.metrics.counter', this.get('model.spec.metrics.' + this.get('model.id')));
      return this.get('spec.metrics');
    }
    return {
      name: "gauge" + this.get('model.id'),
      counter: 0,
    }
  }.property('model'),


  modelUpdated: function() {
    const self = this;
    var type = this.get('model').kind;
    var id = this.get('model').id;
    Ember.run.cancel(self.get('pollTimer'));
    self.set('pollTimer', Ember.run.later(() => {
      var ss = self.get('store').getById(type, id);
      if (ss) {
        self.set('model', ss);
      }
      if (self.get('pollTimer')) {
        self.modelUpdated();
      }
    }, self.get('pollInterval')));
  },


});
