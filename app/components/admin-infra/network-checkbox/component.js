import Ember from 'ember';
const {
  get
} = Ember;

export default Ember.Component.extend({
  tagName: 'rio-radio',
  active: false,
  intl: Ember.inject.service(),

  enabler: function() {
    if (this.get('enable')){
      return "";
  } else {
    return "disabled";
  }
}.property('enable'),


    actions: {
      sendType() {
        this.toggleProperty('active');
        this.sendAction('updateNetData', this.get('active'), this.get('data.id'));
      },
    }
});
