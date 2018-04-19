/* global renderChartGauge, d3 */
import Ember from "ember";

export default Ember.Component.extend({
  classNames: ["two_chart"],
  noUrlTitle: 'No url found',
  chart: {},
  pollInterval: 2000,
  pollTimer: null,
  store: Ember.inject.service(),

  //Variables
  degrees: [],
  new_degrees: [],
  difference: 0,
  text: null,
  animation_loop: null,
  redraw_loop: null,

  modelchanged: function() {
    this._updateGaugeBox();
    this._updateGaugeSvg();
  }.observes('model', 'model.counter'),

  _updateGaugeBox: function() {
    this.draw();
  },

  _updateGaugeSvg: function() {
    var id = this.get('model').id;
    this.get('chart')[id].svgHeight(500)
      .svgWidth(500)
      .data({
        value: Math.round(this.get('model').counter)
      });
  },

  initializeChart: Ember.on('didInsertElement', function() {
    var id = this.get('model').id;
    this.$(".gauge_box").append('<div class = "contant_bar"><canvas id = "canvas_back_' + id + '" width = "177" height = "138" class = "canvas_back"></canvas></div><div class="contant"><div class= "row_1"></div><div class= "row_2"></div><div class= "row_3"></div><div class= "row_4"></div><div class= "row_5"></div></div>');

    //initial render of chart gauge
    this.get('chart')[id] = renderChartGauge();
    this.get('chart')[id].svgHeight(450)
      .svgWidth(450)
      .data({
        value: Math.round(this.get('model').counter)
      });
    d3.select(".hex_chart" + id).call(this.get('chart')[id]);

    var image = new Image();
    image.src = "data:image/png;base64,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";

    image.onload = function() {
      var canvas_back = document.getElementById("canvas_back_" + id);
      var ctx_back = canvas_back.getContext("2d");
      ctx_back.drawImage(image, 0, 0);
    };


    Ember.run.scheduleOnce('afterRender', this, function() {
      var k_val = 0,
        i, j;

      for (j = 1; j < 6; j++) {
        for (i = 1; i < 8; i++) {
          ++k_val;
          this.$(".row_" + j).append('<img class = "element" value = "' + k_val + '" id="ele_' + i + '"  src="data:image/png;base64,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" />');
        }
      }
      this._updateGaugeBox();
      this._updateGaugeSvg();
    });
  }),


  draw: function() {

    const self = this;
    self.$('.contant .element').css("opacity", "0");
    var counter = Math.floor(self.get('model').counter / 2.85);
    for (var i = 0; i < counter; i++) {
      self.$(".contant img[value='" + i + "']").css("opacity", "1");
    }
  }

});
