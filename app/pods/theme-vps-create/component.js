import Ember from 'ember';

export default Ember.Component.extend({

  initializeChart: Ember.on('didInsertElement', function() {
    var self = this;

    if (this.get('model.settings.computeType') == "cpu") {
      self.set('cpuselect', 'cpu-checked');
    } else {
      self.set('gpuselect', 'gpu-checked');
    }

    self.set("model.assemblyfactory.resources.compute_type", this.get('model.settings.computeType'));
    self.sendAction('done', "step1");
    self.$("#cg-close").click(function(e) {
      self.$(".opened-info").addClass("disabled");
      self.$(".pick-cloud").removeClass("disabled");
    });

    self.$("#cg-info").click(function(e) {
      self.$(".opened-info").removeClass("disabled");
      self.$(".pick-cloud").addClass("disabled");
    });

  }),

  actions: {
    gpu: function() {
      this.set('cpuselect', '');
      this.set('gpuselect', 'gpu-checked');
      this.set("model.assemblyfactory.resources.compute_type", "gpu");
      this.sendAction('done', "step1");
    },

    cpu: function() {
      this.set('gpuselect', '');
      this.set('cpuselect', 'cpu-checked');
      this.set("model.assemblyfactory.resources.compute_type", "cpu");
      this.sendAction('done', "step1");
    },
  }
});
