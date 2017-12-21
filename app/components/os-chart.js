/* global renderChartGauge,renderChartArea, d3 */
import Ember from 'ember';
export default Ember.Component.extend({
  classNames: ["text-center os-chart-wrapper"],
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
        value: 66
      });

      chart3.svgHeight(200)
        .svgWidth(700)
        .data({
          entities: this.OsUsageData()
        });

        this.set('ch3', chart3);


    d3.select(".gauge5").call(chart5.hasLegs(false));

      this.set('overall', chart5);

  }),
  updateData: function(){
    const self = this;
    self.get('overall').data({
      value: self.get('model.content').objectAt(0).results.osusages.cumulative.counter
    });

    const chart3 = this.get('ch3');
    chart3.data({
      entities: this.OsUsageData()
    });

    d3.select("#areaGraph")
      .call(chart3);

  },
  OsUsageData: function() {
    const self = this;
    const data = self.get('model.content').objectAt(0).results.osusages.item.map(function(item) {
      var gradient = [];
      switch (item.name) {
        case "windows":
          gradient = ["#00FFAF", '#00DC52'];
          break;
        case "ubuntu":
          gradient = ["#CC9008", '#F74479'];
          break;
        case "apple":
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


});
