import Ember from 'ember';
const {
  get
} = Ember;

export default Ember.Component.extend({

  intl: Ember.inject.service(),

  didInsertElement() {
    this.set('welcomeMsg', Ember.String.htmlSafe(get(this, 'intl').t('wizard.welcomeMessage')));
  },

  actions: {
    nextStep: function() {
      this.sendAction('nextStep');
    },
  },
});
