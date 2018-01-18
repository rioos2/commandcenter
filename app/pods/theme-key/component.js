import Ember from 'ember';

export default Ember.Component.extend({

  tagName: '',

  initializeChart: Ember.on('didInsertElement', function() {
    if (this.get('model.settings.secret') == this.get('key')) {
      this.sendAction('getSecretType', this.get('key'));
      this.set("active", "selected");
    }
  }),

  selectionChecker: function() {
    var check = this.get("secretType") == this.get("key");
    if (check) {
      this.set("active", "selected");
    } else {
      this.set("active", "");
    }
  }.observes('activate'),

  actions: {
    sendType() {
      this.sendAction('getSecretType', this.get('key'));
    },
  }
});
