/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ["home"],

	initializeChart: Ember.on('didInsertElement', function() {
        var self = this;
        var navListItems = self.$('div.setup-panel div a'),
            allWells = self.$('.setup-content');

        allWells.hide();

        navListItems.click(function(e) {
            e.preventDefault();
            var $target = self.$(self.$(this).attr('href')),
                item = self.$(this);
                allWells.hide();
                $target.show();
                $target.find('input:eq(0)').focus();
        });

        self.$(".setup-panel a").click(function(e){
            var directTo = self.$(this).attr('value');
            console.log(directTo);
            self.$(this).parent().addClass("btn-pending").removeClass("btn-select");
            self.$("." + directTo).addClass("btn-select").removeClass("btn-pending");
        });

        self.$('div.setup-panel div .btn-select a.first-show').trigger('click');
  })

});
