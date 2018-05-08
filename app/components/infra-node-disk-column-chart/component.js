import Ember from 'ember';
import C from 'nilavu/utils/constants';

export default Ember.Component.extend({

  isActive: false,

  didInsertElement() {
    this.send('processFilter', this.get('diskTypes').get('firstObject'));
  },

  drawProcessStatistics() {
    var self = this;
    google.charts.load("current", {packages:['corechart']});
     google.charts.setOnLoadCallback(drawChart);
     function drawChart() {
       var data = google.visualization.arrayToDataTable([
         ["Types", "MB/s", { role: "style" } ],
         ["reads MB/s", 8.94, "#3366cc"],
         ["write MB/s", 10.49, "#329ac7"],
         ["io MB/s (read + write)", 19.30, "#f69930"]
       ]);

       var view = new google.visualization.DataView(data);
       view.setColumns([0, 1,
                        { calc: "stringify",
                          sourceColumn: 1,
                          type: "string",
                          role: "annotation" },
                        2]);

       var options = {
         title: "Disk IO statistics",
         vAxis: {
           minValue: 0,
           title: 'The number of I/Os currently in progress',

         },
         width: 440,
         height: 320,
         bar: {groupWidth: "32%"},
         legend: { position: "none" },
       };
       var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
       chart.draw(view, options);
   }
  },

  diskTypeEmpty: function() {
    return Ember.isEmpty(this.get('diskTypes'));
  }.property('model.network'),

  diskTypes: function() {
    return this.get('model.network').map((n) => {
      return n.name;
    });
  }.property('model.network'),

  showDropDown: function() {
    return this.get('isActive') ? 'active' : '';
  }.property('isActive'),

  filteredData: function(type) {
      return this.diskData();
  },

  diskData: function() {
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
