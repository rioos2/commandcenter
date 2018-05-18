import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'rio-radio',
  active: false,

  actions: {
    sendType() {
      this.toggleProperty('active');
      this.sendAction('updateData', this.get('active'),this.get('data.id'));
    },
  }
});
