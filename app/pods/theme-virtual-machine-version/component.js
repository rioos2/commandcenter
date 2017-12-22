import Ember from 'ember';
import DefaultVps from 'nilavu/models/default-vps';

export default Ember.Component.extend({
  tagName: '',

  initializeChart: Ember.on('didInsertElement', function() {
    // this.set(DefaultVps.network, "selected");
    if (DefaultVps.destro == this.get('versionDetail.type') && DefaultVps.destroVersion == this.get('versionDetail.version')) {
      this.set("model.assemblyfactory.plan", this.get('versionDetail.id'));
      this.set("model.assemblyfactory.resources.version", this.get('versionDetail.version'));
      this.set("active", "active");
      this.sendAction("done");
    }
  }),

  selectionChecker: function() {
    var check = this.get("model.assemblyfactory.resources.version") == this.get("versionDetail.version");
    alert(this.get("model.assemblyfactory.resources.version"));
    if (!check) {
      this.set("active", "");
    }
  }.observes('activate'),

  actions: {
    chooseVM: function() {
      this.set("model.assemblyfactory.plan", this.get('versionDetail.id'));
      this.set("model.assemblyfactory.resources.version", this.get('versionDetail.version'));
      this.set("active", "active");
      this.sendAction("done");
    }
  }
});
