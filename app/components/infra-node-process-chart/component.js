import Component from '@ember/component';
import C from 'nilavu/utils/constants';
import echarts from 'npm:echarts';
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
      this.set('selectType', type);
      this.buildData(this.filteredData(type));
    },
  },

  buildData(data) {
    let myChart = echarts.init(document.getElementById(`id-process-${  this.get('model').id  }${ this.get('nodeType') }`));
    // specify chart configuration item and data
    let option = {
      title: {
        text:      `Top 10 running processes by percent of ${  this.get('selectType')  } usage`,
        x:          'center',
        textStyle: {
          color:      '#5c5e75',
          fontSize:   15,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger:    'item',
        formatter:  '{a} <br/>{b} : {c} ({d}%)'
      },
      color: [
        '#258be2',
        '#666666',
        '#f45b5b',
        '#8085e9',
        '#8d4654',
        '#7798bf',
        '#aaeeee',
        '#ff0066',
        '#eeaaee',
        '#55bf3b',
        '#df5353',
        '#7798bf',
        '#aaeeee'
      ],
      series: [
        {
          name:   'Running Processes',
          type:   'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data:   data.tasks,
          label:  {
            show:      true,
            formatter: '{b}: {d}%'
          },
          itemStyle: {
            emphasis: {
              shadowBlur:     10,
              shadowOffsetX:  0,
              shadowColor:    'rgba(0, 0, 0, 0.5)',
            }
          }
        }]
    };
    // use configuration item and data specified to show chart

    myChart.setOption(option);
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
    let tasks = [];
    let processStacks = data.map((p) => p.command).filter((v, i, a) => a.indexOf(v) === i);

    processStacks.forEach((k) => {

      var totalValue = 0;

      data.forEach((p) => {
        if (k === p.command) {
          totalValue += parseInt(p.value);
        }
      });
      tasks.push( {
        value:  totalValue,
        name:   k
      })
    });

    return { tasks };
  },

  setEmpty() {
    return {  tasks: [] };
  },

  types: C.PROCESS.TYPE,

});
