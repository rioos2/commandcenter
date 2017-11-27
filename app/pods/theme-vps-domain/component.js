/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';
import DefaultVps from 'nilavu/models/default-vps';

export default Ember.Component.extend({

  domain: DefaultVps.domain,

  initializeChart: Ember.on('didInsertElement', function() {
    var self = this;
    //default
    this.set("model.assemblyfactory.properties.domain",this.get('domain'));


    self.$(".key-type").click(function(e) {
      self.$(".key-type").removeClass("selected");
      self.$(this).addClass("selected");
      self.$(".step2").addClass("btn-success");
    });
  }),

  actions: {
    createDomain: function() {
      this.set("model.assemblyfactory.properties.domain",this.get('domain'));
    },

    createSecret() {
     this.get('model.secret').save();
    },
  }
});
