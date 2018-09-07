import Component from '@ember/component';

export default Component.extend({
  tagName:  '',
  activate: false,

  selectionChecker: function() {
    var check = this.get('model.stacksfactory.os') === this.get('selected.type');

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
    done() {
      this.toggleProperty('activate');
      this.set('meSelected', true);
    },
  }

});
