import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  selectionChecker: function() {
    var check = this.get("model.assemblyfactory.properties.version") == this.get("versionDetail.version");
    if (!check) {
      this.set("active", "");
    }
  }.observes('activate'),

  actions: {
    chooseVM: function() {
      this.set("model.assemblyfactory.plan", this.get('versionDetail.url'));
      this.set("model.assemblyfactory.properties.version",this.get('versionDetail.version'));
      this.set("active", "active");
      console.log(JSON.stringify(this.get('model')));
      this.sendAction("done");
    }
  }
});
