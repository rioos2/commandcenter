import Ember from 'ember';

export default Ember.Component.extend({
  tagName:   'section',
  className: '',

  signupStep: function() {
    return !this.get('model.wizard.registered');
  }.property('model'),

  actions: {
    proceedNextStep() {
      this.sendAction('reloadModel');
      this.sendAction('nextStep', this.get('category'));
    },
  }

});
