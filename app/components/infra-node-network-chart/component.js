import Ember from 'ember';

export default Ember.Component.extend({
  isActive: false,
  didInsertElement() {
    var self = this;
    google.charts.load('current', {
      'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var data = google.visualization.arrayToDataTable(self.get('chartData'));

      var options = {
        title: 'Network Speed Performance',
        hAxis: {
          title: 'Year',
          titleTextStyle: {
            color: '#333'
          }
        },
        vAxis: {
          minValue: 0
        },
        height: 352,
        width: 400
      };

      var chart = new google.visualization.AreaChart(document.getElementById("id-" + self.get('model').id));
      chart.draw(data, options);
    }
  },

  showDropDown: function() {
    return this.get('isActive') ? 'active' : '';
  }.property('isActive'),



  chartData: function() {
    return [
      ['Year', 'Down', 'Up'],
      ['2013', 1000, 400],
      ['2014', 1170, 460],
      ['2015', 660, 1120],
      ['2016', 1030, 540],
      ['2017', 1030, 540],
      ['2018', 1030, 540],
      ['2019', 1030, 540],
      ['2020', 1030, 540]
    ];
  }.property('model'),

  //TODO This is going to implement when network structure conformed from api

  // networkThrouput: function() {
  //   let throuput = [['Year', 'Down', 'Up']];
  //   this.get('model.network').forEach((n) => {
  //     if (n.name = this.get('selectBridge')) {
  //       n.throuput.forEach((t) => {
  //         throuput.push(t);
  //       }.bind(this));
  //     }
  //   }.bind(this));
  //   return throuput;
  // }.property('model.network.@each'),
  //
  // networkError: function() {
  //   let error = [];
  //   this.get('model.network').forEach((n) => {
  //     if (n.name = this.get('selectBridge'))
  //       error = n.error;
  //   });
  //   return error;
  // }.property('model.network.@each'),
  //
  // networkBridge: function() {
  //   return this.get('model.network').map((n) => {
  //     return n.name;
  //   });
  // }.property('model.network.@each'),
  //
  // selectBridge: function() {
  //   return !Ember.isEmpty(this.get('networkBridge')) ? this.get('networkBridge')[0] : " ";
  // }.property('model.network.@each', 'networkBridge')

  actions: {
    selectFilter: function(show) {
      this.toggleProperty('isActive');
    },
  },
});
