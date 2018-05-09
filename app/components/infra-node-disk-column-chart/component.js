import Ember from 'ember';
import C from 'nilavu/utils/constants';

export default Ember.Component.extend({

  isActive: false,

  didInsertElement() {
    this.send('processFilter', this.get('diskTypes').get('firstObject'));
  },

  drawProcessStatistics() {
    var self = this;
    google.charts.load("current", {
      packages: ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      if (Ember.isEmpty(self.get('chartData'))) {
        self.set('chartData', self.setEmpty());
      }
      var data = google.visualization.arrayToDataTable(self.get('chartData.data'));
      var view = new google.visualization.DataView(data);
      view.setColumns([0, 1,
        {
          calc: "stringify",
          sourceColumn: 1,
          type: "string",
          role: "annotation"
        },
        2
      ]);

      var options = {
        title: "Disk IO statistics",
        hAxis: {
          title: 'The number of I/Os currently in progress  ' + self.get('chartData.total'),
          titleTextStyle: {
            color: '#333'
          },
        },
        width: 440,
        height: 320,
        bar: {
          groupWidth: "55%"
        },
        legend: {
          position: "none"
        },
      };
      var chart = new google.visualization.ColumnChart(document.getElementById("id-disk-column-" + self.get('model').id));
      chart.draw(view, options);
    }
  },

  diskTypeEmpty: function() {
    return Ember.isEmpty(this.get('diskTypes'));
  }.property('model.disk'),

  diskTypes: function() {
    return this.get('model.disk').map((n) => {
      return n.name;
    });
  }.property('model.disk'),

  showDropDown: function() {
    return this.get('isActive') ? 'active' : '';
  }.property('isActive'),

  diskData: function(type) {
    let value = this.setEmpty();
    if (!Ember.isEmpty(this.get('model.disk'))) {
      this.get('model.disk').forEach((p) => {
        if (p.name === type) {
          value = this.compressChartData(p)
        }
      });
    }
    return value;

  },

  compressChartData: function(d) {
    return {
      data: [
        ["Types", "MB/s", {
          role: "style"
        }],
        ["reads MB/s", parseFloat(d.node_disk_mega_bytes_read), "#3366cc"],
        ["write MB/s", parseFloat(d.node_disk_mega_bytes_written), "#329ac7"],
        ["io MB/s (read + write)", parseFloat(d.node_disk_io_now), "#f69930"]
      ],
      total: d.node_disk_mega_bytes_io_total
    };
  },

  setEmpty: function() {
    return [
      ["Types", "MB/s", {
        role: "style"
      }],
      ["reads MB/s", 0, "#3366cc"],
      ["write MB/s", 0, "#329ac7"],
      ["io MB/s (read + write)", 0, "#f69930"]
    ], "0";
  },

  actions: {

    selectFilter: function(show) {
      this.toggleProperty('isActive');
    },

    processFilter: function(type) {
      this.set('chartData', this.diskData(type));
      this.drawProcessStatistics();
      this.set('selectType', type);
    },
  },

});
