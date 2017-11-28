/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';
import DefaultVps from 'nilavu/models/default-vps';

export default Ember.Component.extend({

  domain: DefaultVps.domain,
  showSpinner: false,

  initializeChart: Ember.on('didInsertElement', function() {
    var self = this;
    //default
    this.set("model.assemblyfactory.properties.domain",this.get('domain'));
    this.set("model.assemblyfactory.name",this.get('domain'));

    self.$(".key-type").click(function(e) {
      self.$(".key-type").removeClass("selected");
      self.$(this).addClass("selected");
      self.$(".step2").addClass("btn-success");
    });
  }),

  actions: {
    createDomain: function() {
      this.set('showSpinner', true);
      this.set("model.assemblyfactory.properties.domain",this.get('domain'));
      this.set("model.assemblyfactory.name",this.get('domain'));
      this.set('showSpinner',false);
    },

    createSecret() {
     this.get('model.secret').save();
    },
  }
});
