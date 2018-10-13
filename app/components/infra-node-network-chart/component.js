import C from 'nilavu/utils/constants';
import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import echarts from 'echarts';
export default Component.extend({

  isActive: false,
  activate: false,

  showDropDown: function() {
    return this.get('isActive') ? 'active' : '';
  }.property('isActive'),

  chartData: function() {
    return this.filteredData();
  }.property('selectBridge', 'selected'),

  types: function() {
    return C.NETWORK.MEASURETYPES;
  }.property('model'),

  networkBridgeEmpty: function() {
    return isEmpty(this.get('networkBridge'));
  }.property('model.network'),

  networkBridge: function() {
    return this.get('model.network').map((n) => {
      return n.name;
    });
  }.property('networkBridge'),

  selectBridge: function() {
    return !isEmpty(this.get('networkBridge')) ? this.get('networkBridge')[0] : ' ';
  }.property('networkBridge'),

  changed: function() {
    this.buildData(this.filteredData());
  }.observes('selectBridge', 'selected'),

  selected: function() {
    return C.NETWORK.PACKETMEASURETYPE.THROUGHPUT;
  }.property(),

  didInsertElement() {
    this.send('packetFliper', this.get('selected'));
    this.buildData(this.filteredData());
  },

  actions: {

    packetFliper(type) {
      this.set('selected', type);
      this.toggleProperty('activate');
    },

    selectFilter() {
      this.toggleProperty('isActive');
    },

    propagateFilter(opt) {
      this.set('selectBridge', opt);
    },

  },

  buildData(data) {
    let myChart = echarts.init(document.getElementById(`id-${  this.get('model').id  }${ this.get('nodeType') }`));
    // specify chart configuration item and data
    let option = {
      title: {
        text:      'Network Speed',
        subtext:   'MB per second',
        x:         'center',
        textStyle: {
          color:      '#5c5e75',
          fontWeight: 'normal',
          fontSize:   15
        }
      },
      tooltip: { trigger: 'axis'  },
      color:   ['#2192C8', '#17BDD2', '#3AE0C4', '#96EBBC', '#F8E06F', '#FF9997', '#EE5E8E', '#ED5293', '#D3359A',  '#E57FBB', '#E2B0E7', '#A670DD', '#7D50D1', '#A5A7EF'],
      grid:    {
        left:         '3%',
        t:            '4%',
        bottom:       '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.labels,
      },
      yAxis:  { type: 'value' },
      series: data.data,
    };

    // use configuration item and data specified to show chart
    myChart.setOption(option);
  },

  filteredData() {

    if (this.get('selected') === C.NETWORK.PACKETMEASURETYPE.THROUGHPUT) {
      return this.networkThroughput();
    } else {
      return this.networkError();
    }
  },

  networkThroughput() {

    let labels = [];
    let downloadData = [];
    let uploadData = [];

    this.get('model.network').forEach((n) => {
      if (n.name === this.get('selectBridge')) {
        n.throughput.forEach((t) => {
          labels.push(t[0]);
          downloadData.push(t[1]);
          uploadData.push(t[2]);
        });
      }
    });

    return {
      labels,
      data: [
        {
          name: 'Upload',
          type: 'line',
          step: 'start',
          data: uploadData
        },
        {
          name: 'Download',
          type: 'line',
          step: 'middle',
          data: downloadData
        }
      ]
    };
  },

  networkError() {
    let labels = [];
    let downloadData = [];
    let uploadData = [];

    this.get('model.network').forEach((n) => {
      if (n.name === this.get('selectBridge')) {
        n.error.forEach((t) => {
          labels.push(t[0]);
          downloadData.push(t[1]);
          uploadData.push(t[2]);
        });
      }
    });

    return {
      labels,
      data: [
        {
          name: 'Upload',
          type: 'line',
          step: 'start',
          data: uploadData
        },
        {
          name: 'Download',
          type: 'line',
          step: 'middle',
          data: downloadData
        }
      ]
    };
  },

  setEmpty() {
    return [{
      name: 'Upload',
      data: []
    }, {
      name: 'Download',
      data: []
    }];
  },

});
