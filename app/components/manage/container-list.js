import Component from '@ember/component';

export default Component.extend({
  classNames: ['container-list'],
  pollInterval: 2000,
  pollTimer: null,
  store: Ember.inject.service(),

  region: function() {
    return this.get('model.spec.assembly_factory.object_meta.cluster_name');
  }.property('model'),

  image: function() {
    return 'ico_' + this.get('model.spec.plan_data.object_meta.name');
  }.property('model'),

  version: function() {
    return this.get('model.spec.plan_data.version');
  }.property('model'),

  ip: function() {
    return this.get('model.spec.endpoints.subsets.addresses')[0].ip;
  }.property('model'),

  ipType: function() {
    return this.get('model.spec.endpoints.subsets.addresses')[0].protocol_version;
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
      if ( self.get('pollTimer') ) {
        self.modelUpdated();
      }
    }, self.get('pollInterval')));
  },


});
