import Component from '@ember/component';
import {
  get, set, computed, observer
} from '@ember/object';


export default Component.extend({
  tagName:  '',
  activate: false,

  icon: computed('selected', function() {
    return get(this, 'selected.icon');
  }),

  selectionChecker: observer('selected', function() {
    var check = get(this, 'stacksfactory.os') === get(this, 'selected.type');

    if (check) {
      set(this, 'meSelected', true);
    } else {
      set(this, 'meSelected', false);

    }
  }),

  actions: {
    done() {
      this.toggleProperty('activate');
      set(this, 'meSelected', true);
    },
  }

});
