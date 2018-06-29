  export default Ember.Component.extend({
    tagName: 'section',
    className: '',
    selectedInfraTab: 'node',
    panels: [],

    actions: {
      triggerReload: function() {
        alert("dashboard");
        this.sendAction('reloadModel');
      }
    }

  });
