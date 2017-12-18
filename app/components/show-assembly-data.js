import Ember from "ember";
export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['col-md-6', 'col-sm-12', 'm-b-20'],
  noUrlTitle: 'No url found',
  chart: {},
  store: Ember.inject.service(),

  //Variables
  degrees: [],
  new_degrees: [],
  difference: 0,
  text: null,
  animation_loop: null,
  redraw_loop: null,

  name: function() {
    return this.get('model').name;
  }.property('model.name'),

  status: function() {
    return this.get('model.status.phase');
  }.property('model'),

  region: function() {
    return this.get('model.spec.properties.region');
  }.property('model'),

  storage: function() {
    return this.get('model.spec.properties.storage_type');
  }.property('model'),

  distro: function() {
    if (!this.get('model.spec.plan') == "") {
      return this.get('model.spec.plan').split("/")[3];
    }
    return "";
  }.property(),

  host: function() {
    return this.getSelector("vnchost");
  }.property(),

  port: function() {
    return this.getSelector("vncport");
  }.property(),

  timestamp: function() {
    var a = new Date(this.get('model').created_at);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  }.property(),

  getSelector: function(str) {
    var ss = '';
    this.get('model.selector').forEach(function(item) {
      if (item.toLowerCase().includes(str.toLowerCase())) {
        ss = item.split(":")[1];
      }
    });
    return ss;
  }


});
