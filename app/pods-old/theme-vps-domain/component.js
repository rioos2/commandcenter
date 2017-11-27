/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';

export default Ember.Component.extend({

  initializeChart: Ember.on('didInsertElement', function() {
    var self = this;
    self.$(".key-type").click(function(e) {
      self.$(".key-type").removeClass("selected");
      self.$(this).addClass("selected");
      self.$(".step2").addClass("btn-success");
    });
  }),

  actions: {
    createDomain: function() {
      this.set("model.assemblyfactory.properties.domain",this.get('domain'));
    }
  }
});
