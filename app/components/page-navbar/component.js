import Ember from 'ember';

export default Ember.Component.extend({
  access: Ember.inject.service(),

  selector: null,

  actions: {

    logout: function() {
      this.get('access').clearSessionKeys(true, true);
    },

  }
});
