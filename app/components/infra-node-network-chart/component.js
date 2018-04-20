import Ember from 'ember';
import C from 'nilavu/utils/constants';

export default Ember.Component.extend({

  isActive: false,
  selected: C.NETWORK.PACKETMEASURETYPE.THROUGHPUT,

  didInsertElement() {
    this.drawNetworkStatistics();
  },

  drawNetworkStatistics() {
    this.send('packetFliper', this.get('selected'));
    var self = this;
    google.charts.load('current', {
      'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      if(self.get('networkBridgeEmpty')) {
        self.set('chartData', self.setEmpty());
      }
      var data = google.visualization.arrayToDataTable(self.get('chartData'));

      var options = {
        title: 'Network Speed',
        hAxis: {
          title: 'Time',
          titleTextStyle: {
            color: '#333'
          },
          girdlines: {color: '#333', count: 4},
        },
        vAxis: {
          minValue: 0,
          title: 'MB per seconds',

        },
        height: 320,
        width: 460,
        colors: ['#CC9008', '#AA38E6']

      };

      var chart = new google.visualization.AreaChart(document.getElementById("id-" + self.get('model').id));
      chart.draw(data, options);
    }
  },

  showDropDown: function() {
    return this.get('isActive') ? 'active' : '';
  }.property('isActive'),



  chartData: function() {
    return this.filteredData();
  }.property('selectBridge', 'selected'),

  filteredData: function() {

    if (this.get('selected') == C.NETWORK.PACKETMEASURETYPE.THROUGHPUT) {
      return this.networkThroughput();
    } else {
      return this.networkError();
    }
  },

  networkThroughput: function() {
    let throughput = [
      ['Date', 'Download', 'Upload']
    ];
    this.get('model.network').forEach((n) => {
      if (n.name == this.get('selectBridge')) {
        n.throughput.forEach((t,index) => {
          throughput.push(t);
        });
      }
    });
    return throughput;
  },

  networkError: function() {
    let error = [
      ['Date', 'Download', 'Upload']
    ];
    this.get('model.network').forEach((n) => {
      if (n.name == this.get('selectBridge'))
        n.error.forEach((t) => {
          error.push(t);
        });
    });
    return error;
  },

  networkBridgeEmpty: function() {
    return Ember.isEmpty(this.get('networkBridge'));
  }.property('model.network'),

  networkBridge: function() {
    return this.get('model.network').map((n) => {
      return n.name;
    });
  }.property('networkBridge'),

  selectBridge: function() {
    return !Ember.isEmpty(this.get('networkBridge')) ? this.get('networkBridge')[0] : " ";
  }.property('networkBridge'),

  changed: function() {
    this.set('chartData', this.filteredData());
    this.drawNetworkStatistics();
  }.observes('selectBridge', 'selected'),

  setEmpty: function() {
    return [['Year', 'Download', 'Upload'],['0', 0, 0]];
  },

  actions: {

    selectFilter: function(show) {
      this.toggleProperty('isActive');
    },

    propagateFilter: function(opt) {
      this.set('selectBridge', opt);
    },

    packetFliper: function(packetType) {
      this.set('selected', packetType);
      if (packetType == C.NETWORK.PACKETMEASURETYPE.THROUGHPUT) {
        this.set('throuput', 'active');
        this.set('packetError', '');
      } else {
        this.set('packetError', 'active');
        this.set('throuput', '');
      }
    },

  },
});
