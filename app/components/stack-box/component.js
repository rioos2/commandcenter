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
  }.property('assemblyFactory.object_meta.cluster_name'),

  name: function() {
    let nameCollection = this.get('model.object_meta.name').split(".");
    if (!Ember.isEmpty(nameCollection)) {
      return nameCollection[0];
    }
  }.property('model'),

  assemblyPhase: function() {
    return this.get('model.status.phase');
  }.property('model.status.phase'),

  id: function() {
    return this.get('model.id');
  }.property('model.id'),

  assemblyConditionMessage: function() {
    if(!Ember.isEmpty(this.get('model.status.conditions'))) {
      return this.get('model.status.conditions').get('lastObject').reason;
    } else {
      return "";
    }
  }.property('model.status.conditions', 'assemblyStatus'),

  metricsUpdater: function() {
    this.set('model.spec.metrics', this.metricsDataFinder());
  }.property('model.spec.metrics'),

  image: function() {
    return this.get('assemblyFactory.spec.plan.object_meta.name');
  }.property('model'),

  version: function() {
    return this.get('assemblyFactory.spec.plan.version');
  }.property('assemblyFactory.spec.plan.version'),

  addressesLength: function() {
    return this.get('assemblyEndpoint.subsets.addresses').length;
  }.property('assemblyEndpoint.subsets.addresses'),

  country: function() {
    return "_";
  }.property('model'),

  assemblyStatus: function() {
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
  }.property('model.status.phase'),

  assemblyState: function() {
    var state = C.ASSEMBLY.ASSEMBLYON;
    C.ASSEMBLY.ASSEMBLYOFFPHASES.forEach(phase => {
      if (this.get('model.status.phase').toLowerCase() === phase) {
        state = C.ASSEMBLY.ASSEMBLYOFF
      }
    });
    return state;
  }.property('model.status.phase'),

  ip: function() {
    return this.ipFinder();
  }.property('assemblyEndpoint.subsets.addresses.@each.{ip}'),

  ipType: function() {
    return this.ipTypeFinder();
  }.property('assemblyEndpoint.subsets.addresses.@each.{protocol_version}'),

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
    if(this.get('spec.metrics')) {
       this.set('spec.metrics.name', "gauge" + this.get('model.id'));
     }
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


});
