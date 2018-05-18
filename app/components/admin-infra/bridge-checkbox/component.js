import Ember from 'ember';
const {
  get
} = Ember;

export default Ember.Component.extend({
  tagName: 'rio-radio',
  active: false,
  intl: Ember.inject.service(),

    actions: {
      sendType() {
        this.toggleProperty('active');
        this.sendAction('showBridgesForNode', this.get('active'), this.get('bridge'));
      },
    }
});
