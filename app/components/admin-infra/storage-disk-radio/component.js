import Ember from 'ember';
export default Ember.Component.extend({
  tagName: "",
  active: false,

  actions: {
    selection: function() {
       this.toggleProperty('active');
       this.sendAction('updatePoolData', this.get('active'), this.get('point'));
    },
  },

});
