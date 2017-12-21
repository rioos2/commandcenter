/* global renderBlueGaugeChart, d3, particlesJS */
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ["os-chart-wrapper gauge-chart"],
  cpu: '',
  ram: '',
  disk: '',

  guageOne: function() {
    this.updateGuages();
  }.observes('model'),

  initializeChart: Ember.on('didInsertElement', function() {
    // first

    var b1 = renderBlueGaugeChart();
    var b2 = renderBlueGaugeChart();
    var b3 = renderBlueGaugeChart();

    [b1, b2, b3].forEach(function(chart, i) {
      chart
        .data({
          value: 100
        });
      particlesJS("blueGaugeDiv" + (i + 1), {
        "particles": {
          "number": {
            "value": 300,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "size": {
            "value": 3,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          }
        },
      });
    });

    d3.select(".cpu").call(b1);
    d3.select(".ram").call(b2);
    d3.select(".disk").call(b3);

    this.set('cpu', b1);
    this.set('ram', b2);
    this.set('disk', b3);

  }),

  updateGuages: function() {
    const self = this;

    const content = this.get('model.content').objectAt(0);
    content.results.guages.counters.forEach(function(data) {
      var type = data.name.split("_")[0];
      self.get(type).data({
        value: Math.round(data.counter)
      });
      self.$("." + type + "_percent").text(Math.round(data.counter) + "%");
    });
  }

});
