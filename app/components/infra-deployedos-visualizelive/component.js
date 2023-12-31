/* global renderChartGauge,renderChartArea, d3 */
import Ember from 'ember';
export default Ember.Component.extend({
  classNames: ["chart-os"],
  overall: '',
  ch3: '',

  osUsage: function() {
    this.updateData();
  }.observes('model'),

  initializeChart: Ember.on('didInsertElement', function() {
    var chart3 = renderChartArea();

    var chart5 = renderChartGauge();

    chart5.svgHeight(500)
      .svgWidth(500)
      .data({
        value: this.counter()
      });

    chart3.svgHeight(200)
      .svgWidth(700)
      .data({
        entities: this.OsUsageData()
      });

    d3.select("#areaGraph")
        .call(chart3);

    this.set('ch3', chart3);

    d3.select(".gauge5").call(chart5.hasLegs(false));

    this.set('overall', chart5);

  }),

  updateData: function() {
    const self = this;

    self.get('overall').data({
      value: this.counter()
    });

    const chart3 = this.get('ch3');

    chart3.data({
      entities: this.OsUsageData()
    });
  },

  counter: function(){
    return (this.get("model.code") || Ember.isEmpty(this.get('model.content').objectAt(0).results.osusages.cumulative.counter))? "0": Math.round(this.get('model.content').objectAt(0).results.osusages.cumulative.counter);
  },

  OsUsageData: function() {
  if(!this.get("model.code")){
    const self = this;
    const data = self.get('model.content').objectAt(0).results.osusages.items.map(function(item, index) {
      var gradient = [];
      switch (index) {
        case 0:
          gradient = ["#CC9008", '#F74479'];
          break;
        case 1:
          gradient = ["#AA38E6", '#5322D9'];
          break;
        case 2:
          gradient = ["#00FFAF", '#00DC52'];
          break;
        case 3:
          gradient = ["#4EE2FA", '#4EE2FA'];
          break;
        case 4:
          gradient = ["#ffeb3b", '#ff9800'];
          break;
        default:
          gradient = ["#AA38E6", '#5322D9'];
          break;
      }
      return {
        id: item.id,
        name: item.name,
        gradient: gradient,
        values: item.values
      };
    });
    return data;
  }
  return [];
  }
});
