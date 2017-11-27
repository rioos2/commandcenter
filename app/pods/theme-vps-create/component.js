/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';
import DefaultVps from 'nilavu/models/default-vps';


export default Ember.Component.extend({

  initializeChart: Ember.on('didInsertElement', function() {
    var self = this;
    let id = "#" + DefaultVps.computeType;
    let computeClass = DefaultVps.computeType + "-checked"
    self.$(id).addClass(computeClass);
    self.set("model.assemblyfactory.component_collection.compute_type", DefaultVps.computeType);

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
      var self = this;
      self.$("#gpu").addClass("gpu-checked");
      self.$("#cpu").removeClass("cpu-checked");
			self.set("model.assemblyfactory.component_collection.compute_type", "gpu");
      console.log(JSON.stringify(this.get('model')));
    },

    cpu: function() {
      var self = this;
      self.$("#cpu").addClass("cpu-checked");
      self.$("#gpu").removeClass("gpu-checked");
			self.set("model.assemblyfactory.component_collection.compute_type", "cpu");
    },
  }
});
