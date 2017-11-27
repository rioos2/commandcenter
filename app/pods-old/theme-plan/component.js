import Ember from 'ember';

export default Ember.Component.extend({

  tagName: '',

  actions: {
    selected() {
      this.sendAction('refreshAfterAction', this.get('vm'));
    },
  }

});
