/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';
import DefaultVps from 'nilavu/models/default-vps';


export default Ember.Component.extend({

  initializeChart: Ember.on('didInsertElement', function() {
    var self = this;

    if (DefaultVps.computeType == "cpu") {
      self.set('cpuselect', 'cpu-checked');
    } else {
      self.set('gpuselect', 'gpu-checked');
    }

    self.set("model.assemblyfactory.component_collection.compute_type", DefaultVps.computeType);
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
      this.set("model.assemblyfactory.component_collection.compute_type", "gpu");
      this.sendAction('done', "step1");
    },

    cpu: function() {
      this.set('gpuselect', '');
      this.set('cpuselect', 'cpu-checked');
      this.set("model.assemblyfactory.component_collection.compute_type", "cpu");
      this.sendAction('done', "step1");
    },
  }
});
