import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  activate: false,

  actions: {
    done() {
      this.toggleProperty("activate");
    },
  }

});
