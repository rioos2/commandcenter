  export default Ember.Component.extend({
    tagName: 'section',
    className: '',
    selectedInfraTab: 'node',
    panels: [],

    actions: {
      triggerReload: function() {
        this.sendAction('reloadModel');
      }
    }

  });
