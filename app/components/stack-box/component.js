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

  initializeChart: Ember.on('didInsertElement', function() {
    this.modelUpdated();
  }),

  region: function() {
    return this.get('assemblyFactory.object_meta.cluster_name');
  }.property('model'),

  name: function() {
    let nameCollection = this.get('model.object_meta.name').split(".");
    if (!Ember.isEmpty(nameCollection)) {
      return nameCollection[0];
    }
  }.property('model'),

  assemblyPhase: function() {
    return this.get('model.status.phase');
  }.property('model.status.phase'),

  assemblyStatusUpdate: function() {
    this.set('assemblyStatus', this.assemblyStatusChecker());
    this.set('assemblyState', this.assemblyStateFinder());
  }.observes('model.status.phase'),

  ipUpdater: function() {
    this.set('ip',this.ipFinder());
    this.set('ipType',this.ipTypeFinder());
  }.observes('assemblyEndpoint.subsets.addresses'),

  metricsUpdater: function() {
    this.set('model.spec.metrics', this.metricsDataFinder());
  }.observes('model.spec.metrics'),

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
    return this.assemblyStatusChecker();
  }.property('model'),

  assemblyStatusChecker: function() {
    var state = "";
    C.MANAGEMENT.STATUS.WARNING.forEach(status => {
      if(status === this.get('model.status.phase').toLowerCase()) {
        state = C.MANAGEMENT.STATE.WARNING;
      }
    });
    C.MANAGEMENT.STATUS.FAILURE.forEach(status => {
      if(status === this.get('model.status.phase').toLowerCase()) {
        state = C.MANAGEMENT.STATE.FAILURE;
      }
    });
    C.MANAGEMENT.STATUS.SUCCESS.forEach(status => {
      if(status === this.get('model.status.phase').toLowerCase()) {
        state = C.MANAGEMENT.STATE.SUCCESS;
      }
    });
    return state;
  },

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
    return this.ipFinder();
  }.property('model'),

  ipType: function() {
    return this.ipTypeFinder();
  }.property('model'),

  ipFinder: function() {
    if (!Ember.isEmpty(this.get('assemblyEndpoint.subsets.addresses'))) {
      return this.get('assemblyEndpoint.subsets.addresses')[0].ip;
    }
    return "Not yet assigned";
  },

  ipTypeFinder: function() {
    if (!Ember.isEmpty(this.get('assemblyEndpoint.subsets.addresses'))) {
      return this.get('assemblyEndpoint.subsets.addresses')[0].protocol_version;
    }
    return C.ASSEMBLY.ASSEMBLYIPV4;
  },

  metricsData: function() {
    this.set('spec.metrics.name', "gauge" + this.get('model.id'));
    return this.metricsDataFinder();
  }.property('model'),

  metricsDataFinder: function() {
    if (!(this.get('model.spec.metrics.' + this.get('model.id')) == undefined)) {
      this.set('model.spec.metrics.counter', parseInt(this.get('model.spec.metrics.' + this.get('model.id'))));
      return this.get('spec.metrics');
    }
    return {
      name: "gauge" + this.get('model.id'),
      counter: 0,
    }
  },


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
