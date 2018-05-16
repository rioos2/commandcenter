import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'rio-radio',
  enable: '',
  active: false,

  actions: {
    sendType() {
      this.toggleProperty('active');
      this.sendAction('updatePoolData', this.get('active'),this.get('name'));
    },
  }
});
