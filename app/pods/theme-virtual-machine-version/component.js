import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  selectionChecker: function() {
    var check = this.get("model.assemblyfactory.resources.version") == this.get("versionDetail.version");
    if (!check) {
      this.set("active", "");
    }
  }.observes('activate'),

  active: function() {
    return (this.get("model.assemblyfactory.os") == this.get("versionDetail.type") && this.get("model.assemblyfactory.resources.version") == this.get("versionDetail.version")) ? "active" : "";
  }.property('model.assemblyfactory.os', 'model.assemblyfactory.resources.version'),

  actions: {
    chooseVM: function() {
      this.set("model.assemblyfactory.plan", this.get('versionDetail.id'));
      this.set("model.assemblyfactory.resources.version", this.get('versionDetail.version'));
      this.set("model.assemblyfactory.os", this.get('versionDetail.type'));
      this.set("active", "active");
      this.sendAction("done", this.get('versionDetail.type'));
    }
  }
});
