import Ember from 'ember';
const {
  get
} = Ember;

export default Ember.Component.extend({
  tagName: 'rio-radio',
  active: false,
  intl: Ember.inject.service(),

  enabler: function() {
    if (this.get('active')){
      return "";
  } else {
    this.send('sendBridge', "");
    return "disabled";
  }
}.property('active'),

actions: {
  sendType() {
    this.toggleProperty('active');
    this.sendAction('updatePoolData', this.get('active'), this.get('name'));
  },
  sendBridge(bridgeName) {
    this.sendAction('setBridge', this.get('active'), {
      name: this.get('data.node_id'),
      value: bridgeName
    });
  },
}
});
