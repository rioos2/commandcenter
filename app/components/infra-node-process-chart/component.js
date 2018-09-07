import Ember from 'ember';
import C from 'nilavu/utils/constants';

export default Ember.Component.extend({

  isActive: false,
  types: C.PROCESS.TYPE,

  didInsertElement() {
    this.send('processFilter', this.get('types')[0]);
  },

  drawProcessStatistics() {
    var self = this;
    google.charts.load("current", {
      packages: ["corechart"]
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      if (Ember.isEmpty(self.get('chartData'))) {
        self.set('chartData', self.setEmpty());
      }
      var data = google.visualization.arrayToDataTable(self.get('chartData'));

      var options = {
        title: "Top 10 running processes by percent of " + self.get('selectType') + " usage",
        is3D: true,
        height: 320,
        width: 460,
        // Please open it if the colors wants as like as OS USAGE
        // colors: ['#F74479', '#AA38E6', '#00FFAF', '#4EE2FA', '#ffeb3b']
      };

      var chart = new google.visualization.PieChart(document.getElementById("id-process-" + self.get('model').id+self.get('nodeType')));
      chart.draw(data, options);
    }
  },

  showDropDown: function() {
    return this.get('isActive') ? 'active' : '';
  }.property('isActive'),

  selectType: function() {
    return this.get('types')[0];
  }.property('types'),

  filteredData: function(type) {

    if (this.get('types')[0] == type) {
      return this.cpuData();
    } else {
      return this.memData();
    }
  },

  cpuData: function() {
    let value = "";
    if (this.get('model.process')) {
      this.get('model.process').forEach((p) => {
        if (p.node_process_cpu) {
          value = this.compressChartData(p.node_process_cpu)
        }
      });
    }
    return value;
  },

  memData: function() {
    let value = "";
    if (this.get('model.process')) {
      this.get('model.process').forEach((p) => {
        if (p.node_process_mem) {
          value = this.compressChartData(p.node_process_mem)
        }
      });
    }
    return value;

  },

  compressChartData: function(data) {
    let process = [
      ['Task', 'Current data'],
    ];
    let processStacks = data.map((p) => p.command).filter((v, i, a) => a.indexOf(v) === i);
    processStacks.forEach(function(k) {

      var totalValue = 0;
      data.forEach(function(p) {
        if (k === p.command) {
          totalValue += parseInt(p.value);
        }
      });
      process.push([k, totalValue])
    });
    return process;
  },

  setEmpty: function() {
    return [
      ['Task', 'Current data'],
      ['None', 100]
    ];
  },

  actions: {

    selectFilter: function(show) {
      this.toggleProperty('isActive');
    },

    processFilter: function(type) {
      this.set('chartData', this.filteredData(type));
      this.drawProcessStatistics();
      this.set('selectType', type);
    },
  },

});
