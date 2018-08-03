import Ember from 'ember';
const { get } = Ember;

export default Ember.Component.extend({
  intl:              Ember.inject.service(),
  tagName:           'rio-radio',
  active:            false,
  classNameBindings: ['enable::disabled'],

  actions: {
    sendType() {
      this.toggleProperty('active');
      this.sendAction('updateVirtualNetworkData', this.get('active'), this.get('data.id'));
    },
  }
});
