import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  selectionChecker: function() {
    var check = (this.get("model.assemblyfactory.os") == this.get("versionDetail.type") && this.get("model.assemblyfactory.resources.version") == this.get("versionDetail.version"));
    if (!check) {
      this.set("active", "");
    }
  }.observes('activate'),

  active: function() {
    var check = (this.get("model.assemblyfactory.os") == this.get("versionDetail.type") && this.get("model.assemblyfactory.resources.version") == this.get("versionDetail.version"));
    if (check) {
      this.set("model.assemblyfactory.plan", this.get('versionDetail.id'));
      this.set("model.distro_description", this.get('versionDetail.description'));
    }
    return (this.get("model.assemblyfactory.os") == this.get("versionDetail.type") && this.get('model.assemblyfactory.resources.version') == this.get("versionDetail.version")) ? "selected" : "";
  }.property('model.assemblyfactory.os', 'model.assemblyfactory.resources.version'),

  actions: {
    chooseVM: function() {
      this.set("model.assemblyfactory.plan", this.get('versionDetail.id'));
      this.set("model.assemblyfactory.resources.version", this.get('versionDetail.version'));
      this.set("model.assemblyfactory.os", this.get('versionDetail.type'));
      this.set("model.distro_description", this.get('versionDetail.description'));
      this.set("active", "selected");
      this.sendAction("done", this.get('versionDetail.type'));
    }
  }
});
