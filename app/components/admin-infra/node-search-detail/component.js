import Ember from 'ember';
export default Ember.Component.extend({

  actions: {
    doReload() {
      this.sendAction('reload');
    }
  }
});
