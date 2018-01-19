import Ember from 'ember';

export default Ember.Component.extend({

  tagName: '',
  active: '',

  initializeChart: Ember.on('didInsertElement', function() {
    if (this.get('model.settings.destro') == this.get('vm.type')) {
      this.sendAction('refreshAfterAction', this.get('vm'));
      this.set("active", "active");
    }
  }),

  selectionChecker: function() {
    var check = this.get("model.assemblyfactory.current_os_tab") == this.get("vm.type");
    if (check) {
      this.set("active", "active");
    } else {
      this.set("active", "");
    }
  }.observes('activate'),

  actions: {
    selected() {
      this.sendAction('refreshAfterAction', this.get('vm'));
    },
  }

});
