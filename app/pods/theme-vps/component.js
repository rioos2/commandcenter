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

//Step 1
        self.$("#cpu").click(function() {
            self.$("#cpu").addClass("cpu-checked");
            self.$("#gpu").removeClass("gpu-checked");
            self.$(".step1").addClass("btn-success");

        });

        self.$("#gpu").click(function(e) {
            self.$("#gpu").addClass("gpu-checked");
            self.$("#cpu").removeClass("cpu-checked");
            self.$(".step1").addClass("btn-success");
        });

        self.$("#cg-close").click(function(e){
            self.$(".opened-info").addClass("disabled");
            self.$(".pick-cloud").removeClass("disabled");
        });

        self.$("#cg-info").click(function(e){
            self.$(".opened-info").removeClass("disabled");
            self.$(".pick-cloud").addClass("disabled");
        });
//Step 2
        self.$(".key-type").click(function(e) {
            self.$(".key-type").removeClass("selected");
            self.$(this).addClass("selected");
            self.$(".step2").addClass("btn-success");
        });

//Step 3
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

        self.$(".btn-version").click(function(e) {
            self.$(".btn-version").removeClass("active");
            self.$(this).addClass("active");
        });

//Step 4
        self.$(".step4").addClass("btn-success");

        self.$(".arrow-left").click(function(e) {
            var active_img = self.$(".items img").index(self.$(".items .active"));
            if (active_img != 0) {
                self.$(".items .active").removeClass("active").prev().addClass("active");
            }
            else {
                self.$(".items .active").removeClass("active");
                self.$("#windows").addClass("active");
            }
        });

        self.$(".arrow-right").click(function(e) {
            var active_img = self.$(".items img").index(self.$(".items .active"));
            if (active_img != 4) {
                self.$(".items .active").removeClass("active").next().addClass("active");
            }
            else {
                self.$(".items .active").removeClass("active");
                self.$("#ubuntu").addClass("active");
            }
        });
//Step 5
        self.$(".step5").addClass("btn-success");

//Step 6
        self.$(".net-type").click(function(e) {
            self.$(".net-type").removeClass("selected");
            self.$(this).addClass("selected");
            self.$(".step6").addClass("btn-success");
        });
//chart
        var data1 = {
        value: 3,
        min: 1,
        max: 30,
        description: 'From 1 to 30',
        title: 'Select number of cores'
        }

        var chart1 = renderChartNumberOfCores()
        .container('#numberofcores')
        .data(data1)
        .debug(true)
        .run();
//chart
        var data2 = {
        value: 30,
        min: 0,
        max: 100,
        suffix: ' Gb',
        title: 'ram'
        }

        var chart2 = renderChartRam()
        .container('#ram')
        .data(data2)
        .debug(true)
        .run();
//chart
        var data3 = {
        value: 100,
        min: 0,
        max: 1000,
        suffix: ' Gb',
        description: 'you can set any capacity',
        title: 'storage capacity'
        }

        var chart3 = renderChartLinearProgressSlider()
        .container('#storage')
        .data(data3)
        .debug(true)
        .run();

  })

});
