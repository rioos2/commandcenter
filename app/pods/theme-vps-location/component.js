/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['setup-content'],

  initializeChart: Ember.on('didInsertElement', function() {

    var self = this;
    var properties = self.get("model.assemblyfactory.properties");
    var element = $("#step-3").find(".loc-country");
    if (element.length > 0)
      self.$(".step3").addClass("btn-success");

    self.$(".add-more").click(function(e) {
      self.$("#inputlocation").removeClass("inactive");
      self.$("#inputlocation").addClass("active");
    });

    self.$(".btn-close").click(function(e) {
      self.$("#inputlocation").removeClass("active");
      self.$("#inputlocation").addClass("inactive");
    });

    // self.$(".btn-add").click(function(e) {
    //   properties.region = self.get('region');
    // });
  }),

  actions: {
    createLocation: function() {
      this.set("model.assemblyfactory.properties.region", this.get('region'));
    }
  }

});
