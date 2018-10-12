import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import echarts from 'npm:echarts';
export default Component.extend({

  isActive: false,

  diskTypeEmpty: function() {
    return isEmpty(this.get('diskTypes'));
  }.property('model.disk'),

  diskTypes: function() {
    return this.get('model.disk').map((n) => {
      return n.name;
    });
  }.property('model.disk'),

  showDropDown: function() {
    return this.get('isActive') ? 'active' : '';
  }.property('isActive'),

  didInsertElement() {
    this.send('processFilter', this.get('diskTypes').get('firstObject'));
  },

  actions: {

    selectFilter() {
      this.toggleProperty('isActive');
    },

    processFilter(type) {
      this.buildData(this.diskData(type));
      this.set('selectType', type);
    },
  },

  buildData(data) {
    let myChart = echarts.init(document.getElementById(`id-disk-column-${  this.get('model').id  }${ this.get('nodeType') }`));

    // specify chart configuration item and data
    let option = {
      title: {
        text:      'Disk IO statistics',
        x:          'center',
        textStyle: {
          color:      '#5c5e75',
          fontSize:   15,
          fontWeight: 'normal'
        }
      },
      tooltip: {},
      xAxis:   {
        data:      ['reads MB/s', 'write MB/s', 'io MB/s (read + write)'],
        axisLabel: { textStyle: { color: '#5c5e75' } },
        axisTick:  { show: false  },
        axisLine:  { show: false  },
        z:         10,
      },
      yAxis: {
        axisLine:  { show: false },
        axisLabel: { textStyle: { color: '#999' } }
      },
      series: [{
        name:      'Disk Statistics',
        type:      'bar',
        data:      data.data,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                {
                  offset: 0,
                  color:  '#96EBBC'
                },
                {
                  offset: 0.5,
                  color:  '#188df0'
                },
                {
                  offset: 1,
                  color:  '#3c1c76'
                }
              ]
            )
          },
          emphasis: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                {
                  offset: 0,
                  color:  '#2378f7'
                },
                {
                  offset: 0.7,
                  color:  '#2378f7'
                },
                {
                  offset: 1,
                  color:  '#83bff6'
                }
              ]
            )
          }
        },
      }]
    };

    // use configuration item and data specified to show chart
    myChart.setOption(option);
  },

  diskData(type) {
    let value = this.setEmpty();

    if (!isEmpty(this.get('model.disk'))) {
      this.get('model.disk').forEach((p) => {
        if (p.name === type) {
          value = this.compressChartData(p)
        }
      });
    }

    return value;

  },

  compressChartData(d) {
    return {
      data: [
        parseFloat(d.node_disk_mega_bytes_read),
        parseFloat(d.node_disk_mega_bytes_written),
        parseFloat(d.node_disk_mega_bytes_io_total)
      ],
      total: d.node_disk_io_now
    };
  },

  setEmpty() {
    return {
      data:  [],
      total: 0
    };
  },

});
