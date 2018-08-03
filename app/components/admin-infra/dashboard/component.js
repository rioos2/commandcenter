export default Ember.Component.extend({
  tagName:          'section',
  className:        '',
  selectedInfraTab: 'sensei',
  panels:           [],

  actions: {
    triggerReload() {
      this.sendAction('reloadModel');
    }
  }

});
