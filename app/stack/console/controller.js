export default Ember.Controller.extend({
  queryParams: [
    'vnchost', 'vncport'
  ],
  host: null,
  port: null,
  name: null,
  sendCtrlAltDel: false,

  vncname: function() {
    return "VNC viewer  " + this.get('name');
  }.property('name'),

  vncPort: function() {
    this.set('vncport', this.get('model.port'));
  }.observes('model.port'),

  vncHost: function() {
    this.set('vnchost', this.get('model.host'));
  }.observes('model.host'),

  actions: {
    close() {
      window.close();
    },
    ctrlAltDel() {
      this.toggleProperty('sendCtrlAltDel');
    }
  }

});
