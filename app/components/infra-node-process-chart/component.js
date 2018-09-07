import Component from '@ember/component';
import C from 'nilavu/utils/constants';
import { isEmpty } from '@ember/utils';

export default Component.extend({

  isActive:     false,
  showDropDown: function() {
    return this.get('isActive') ? 'active' : '';
  }.property('isActive'),

  selectType: function() {
    return this.get('types')[0];
  }.property('types'),

  didInsertElement() {
    this.send('processFilter', this.get('types')[0]);
  },

  actions: {

    selectFilter() {
      this.toggleProperty('isActive');
    },

    processFilter(type) {
      this.set('chartData', this.filteredData(type));
      this.drawProcessStatistics();
      this.set('selectType', type);
    },
  },

  drawProcessStatistics() {
    var self = this;

    google.charts.load('current', { packages: ['corechart'] }); // eslint-disable-line
    google.charts.setOnLoadCallback(drawChart); // eslint-disable-line

    function drawChart() {
      if (isEmpty(self.get('chartData'))) {
        self.set('chartData', self.setEmpty());
      }
      var data = google.visualization.arrayToDataTable(self.get('chartData')); // eslint-disable-line

      var options = {
        title:  `Top 10 running processes by percent of ${  self.get('selectType')  } usage`,
        is3D:   true,
        height: 320,
        width:  460,
        // Please open it if the colors wants as like as OS USAGE
        // colors: ['#F74479', '#AA38E6', '#00FFAF', '#4EE2FA', '#ffeb3b']
      };

      var chart = new google.visualization.PieChart(document.getElementById(`id-process-${  self.get('model').id  }${ self.get('nodeType') }`)); // eslint-disable-line

      chart.draw(data, options);
    }
  },

  filteredData(type) {

    if (this.get('types')[0] === type) {
      return this.cpuData();
    } else {
      return this.memData();
    }
  },

  cpuData() {
    let value = '';

    if (this.get('model.process')) {
      this.get('model.process').forEach((p) => {
        if (p.node_process_cpu) {
          value = this.compressChartData(p.node_process_cpu)
        }
      });
    }

    return value;
  },

  memData() {
    let value = '';

    if (this.get('model.process')) {
      this.get('model.process').forEach((p) => {
        if (p.node_process_mem) {
          value = this.compressChartData(p.node_process_mem)
        }
      });
    }

    return value;

  },

  compressChartData(data) {
    let process = [
      ['Task', 'Current data'],
    ];
    let processStacks = data.map((p) => p.command).filter((v, i, a) => a.indexOf(v) === i);

    processStacks.forEach((k) => {

      var totalValue = 0;

      data.forEach((p) => {
        if (k === p.command) {
          totalValue += parseInt(p.value);
        }
      });
      process.push([k, totalValue])
    });

    return process;
  },

  setEmpty() {
    return [
      ['Task', 'Current data'],
      ['None', 100]
    ];
  },

  types: C.PROCESS.TYPE,

});
