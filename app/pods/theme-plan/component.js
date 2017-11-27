import Ember from 'ember';
import DefaultVps from 'nilavu/models/default-vps';

export default Ember.Component.extend({

  tagName: '',
  active: '',

  initializeChart: Ember.on('didInsertElement', function() {
    if (DefaultVps.destro == this.get('vm.type')) {
      this.sendAction('refreshAfterAction', this.get('vm'));
      this.set("active", "active");
    }
  }),

  selectionChecker: function() {
    var check = this.get("model.assemblyfactory.os") == this.get("vm.type");
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
