/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';

export default Ember.Component.extend({
  
  initializeChart: Ember.on('didInsertElement', function() {
    var self = this;
    self.$(".step4").addClass("btn-success");
  })

});
