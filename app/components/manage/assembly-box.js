import Component from '@ember/component';

export default Component.extend({
  classNames: ['container-list'],
  pollInterval: 2000,
  pollTimer: null,
  store: Ember.inject.service(),

  region: function() {
    return this.get('model.spec.assembly_factory.object_meta.cluster_name');
  }.property('model'),

  name: function() {
    return this.get('model.object_meta.name').split(".")[0];
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

  dummyMet: function() {
    var self = this;
    window.setInterval(function() {
      self.dynamicDummyUpdate();
    }, 2000);
    return {
      name: "gauge"+ this.get('model.id'),
      counter: Math.floor(Math.random() * 25) + 1,
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
