import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  activate: false,

  selectionChecker: function() {
    var check = this.get("model.assemblyfactory.os") == this.get("selected.type");
    if (check) {
      this.set("meSelected", true);
    } else {
      this.set("meSelected", false);

    }
  }.observes('selected'),

  actions: {
    done(data) {
        this.toggleProperty("activate");
        this.set('meSelected', true);
    },
  }

});
