export default Ember.Component.extend({
  tagName: 'section',
  className: '',
  selectedSettingTab: 'entitlement',
  panels: [],

  licenses: function(){
    return Ember.isEmpty(this.get('model.license.content'))? [] : this.get('model.license.content');
  }.property('model.license'),

  actions: {
    triggerReload: function() {
      this.sendAction('reloadModel');
    }
  }

});
