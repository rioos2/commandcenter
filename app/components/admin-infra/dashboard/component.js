  export default Ember.Component.extend({
    tagName: 'section',
    className: '',
    selectedInfraTab: 'sensei',
    panels: [],

    actions: {
      triggerReload: function() {
        this.sendAction('reloadModel');
      }
    }

  });
