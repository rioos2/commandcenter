import Ember from 'ember';
export default Ember.Component.extend({

  actions: {
    doReload: function() {
      this.sendAction('reload');
    }
  }
});
