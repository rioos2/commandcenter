/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';
import DefaultVps from 'nilavu/models/default-vps';

export default Ember.Component.extend({
  region: DefaultVps.region,
  showSpinner: false,

	initializeChart: Ember.on('didInsertElement', function() {

        var self = this;
				this.set("model.assemblyfactory.properties.region", this.get('region'));
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
      this.set('showSpinner', true);
			this.set("model.assemblyfactory.properties.region", this.get('region'));
      this.set('showSpinner', false);
		}
	}

});
