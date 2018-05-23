import Ember from 'ember';
const {
  get
} = Ember;

export default Ember.Component.extend({
  tagName: 'rio-radio',
  active: false,
  intl: Ember.inject.service(),

  enabler: function() {
    if (this.get('active')) {
      return "";
    } else {
      this.send('sendBridge', "");
      return "disabled";
    }
  }.property('active'),

  bridges: function() {
    var self = this;
    return this.get('data.bridges').map(function(bridge) {
      if (bridge.types.includes(self.get('type')))
        return bridge;
    }).filter(val => val !== undefined);
  }.property('type'),

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
