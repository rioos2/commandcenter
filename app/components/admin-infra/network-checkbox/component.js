import Ember from 'ember';
const {
  get
} = Ember;
export default Ember.Component.extend({
  tagName: 'rio-radio',
  active: false,
  intl: Ember.inject.service(),
  classNameBindings: ['enable::disabled'],

    actions: {
      sendType() {
        this.toggleProperty('active');
        this.sendAction('updateVirtualNetworkData', this.get('active'), this.get('data.id'));
      },
    }
});
