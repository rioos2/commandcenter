import Ember from 'ember';

export default Ember.Component.extend({
  access: Ember.inject.service(),
  dropdownOpen: false,

  selector: null,
  didInsertElement: function() {
    // this.$('.navbar-brand').hover(
    //     function() {$(this).addClass('animated quick-shake')},
    //     function() {$(this).removeClass('animated quick-shake')}
    //     );
  },

  actions: {

    logout: function() {
      this.get('access').clearSessionKeys(true, true);
    },
    toggleDropdown() {
      this.toggleProperty('dropdownOpen');
    }
  }
});
