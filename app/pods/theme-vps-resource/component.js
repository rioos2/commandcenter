/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';

export default Ember.Component.extend({

  initializeChart: Ember.on('didInsertElement', function() {
    this.sendAction('done', "step4");
  })

});
