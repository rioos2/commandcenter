import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  intl: service(),

  tagName: 'rio-radio',
  active:  function(){
    return this.get('data.active');
  }.property('data.active'),

  enabler: function() {
    if (this.get('active')) {
      return '';
    } else {
      return 'disabled';
    }
  }.property('active'),

  bridges: function() {
    var self = this;

    return this.get('data.bridges').map((bridge) => {
      if (bridge.types.includes(self.get('type'))) {
        return bridge;
      }
    }).filter((val) => val !== undefined);
  }.property('type'),

  actions: {
    sendType() {
      this.toggleProperty('active');
      this.sendAction('updatePoolData', this.get('active'), this.get('name'));
    },
    sendBridge(bridgeName) {
      this.sendAction('setBridge', this.get('active'), {
        name:  this.get('data.node_id'),
        value: bridgeName
      });
    },
  }
});
