import Ember from 'ember';
export default Ember.Component.extend({

  actions: {
    doReloaded: function() {
      this.sendAction('nodeReload');
    }
  }
});
