import Ember from 'ember';

export default Ember.Component.extend({
  tagName:  '',
  activate: false,

  selectionChecker: function() {
    var check = this.get('model.stacksfactory.os') == this.get('selected.type');

    if (check) {
      this.set('meSelected', true);
    } else {
      this.set('meSelected', false);

    }
  }.observes('selected'),

  icon: function() {
    return this.get('selected.icon');
  }.property('selected'),

  actions: {
    done(data) {
      this.toggleProperty('activate');
      this.set('meSelected', true);
    },
  }

});
