import Ember from 'ember';
import Config from 'nilavu/mixins/config';
import C from 'nilavu/utils/constants';
export function denormalizeName(str) {
  return str.replace(new RegExp('['+C.SETTING.DOT_CHAR+']','g'),'.').toLowerCase();
}
export default Ember.Component.extend(Config,{

  initializeChart: Ember.on('didInsertElement', function() {
    var self = this;

    if (self.validateComputeType() == "cpu") {
      self.set('cpuselect', 'cpu-checked');
    } else {
      self.set('gpuselect', 'gpu-checked');
    }

    self.set("model.assemblyfactory.resources.compute_type", this.validateComputeType());
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

  validateComputeType: function () {
    return this.get('model.settings')[denormalizeName(`${C.SETTING.COMPUTE_TYPE}`)] || this.defaultVPS().computeType;
  },

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
