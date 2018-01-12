import Component from '@ember/component';

export default Component.extend({
  classNames: ['container-list'],
  pollInterval: 2000,
  pollTimer: null,
  store: Ember.inject.service(),
  offAssembly: ["Stopped", "Failed"],

  region: function() {
    return this.get('model.spec.assembly_factory.object_meta.cluster_name');
  }.property('model'),

  name: function() {
    return this.get('model.object_meta.name').split(".")[0];
  }.property('model'),

  host: function() {
    if (this.get('model.metadata.host')) {
      return this.get('model.metadata.host');
    }
    return ""
  }.property('model'),

  port: function() {
    if (this.get('model.metadata.port')) {
      return this.get('model.metadata.port');
    }
    return ""
  }.property('model'),

  image: function() {
    return 'ico_' + this.get('model.spec.assembly_factory.spec.plan.object_meta.name');
  }.property('model'),

  version: function() {
    return this.get('model.spec.assembly_factory.spec.plan.version');
  }.property('model'),

  addressesLength: function() {
    return this.get('model.spec.endpoints.subsets.addresses').length;
  }.property('model'),

  country: function() {
    return "_";
  }.property('model'),

  assemblyStatus: function() {
    return this.get('model.status.phase').toLowerCase();
  }.property('model'),

  assemblyState: function() {
    var state = "ON";
    this.get('offAssembly').forEach(phase => {
      if (this.get('model.status.phase') === phase) {
        state = "OFF"
      }
    });
    return state;
  }.property('model'),

  ip: function() {
    if (this.get('addressesLength') < 0) {
      return this.get('model.spec.endpoints.subsets.addresses')[0].ip;
    }
    return "Not yet assigned";
  }.property('model'),

  ipType: function() {
    if (this.get('addressesLength') < 0) {
      return this.get('model.spec.endpoints.subsets.addresses')[0].protocol_version;
    }
    return "IPv4";
  }.property('model'),

  metricsData: function() {
    if (!JSON.stringify(this.get('model.spec.metrics')) === JSON.stringify({})) {
      this.set('model.spec.metrics.name', "gauge" + this.get('model.id'));
      let path = 'model.spec.metrics.' + this.get('model.id');
      let counter = this.get(path);
      this.set('model.spec.metrics.counter', counter);
      return this.get('model.spec.metrics');
    }
    return {
      name: "gauge" + this.get('model.id'),
      counter: 0,
    }
  }.property('model'),

  dynamicDummyUpdate: function() {
    this.set('dummyMet.counter', Math.floor(Math.random() * 10) + 1)
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
