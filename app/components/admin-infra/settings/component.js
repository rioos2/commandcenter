export default Ember.Component.extend({
  tagName: 'section',
  className: '',
  selectedSettingTab: 'entitlement',
  panels: [],

  license: function(){
    return this.get('model.license');
  }.property('model.license'),

  actions: {
    triggerReload: function() {
      this.sendAction('reloadModel');
    }
  }

});
