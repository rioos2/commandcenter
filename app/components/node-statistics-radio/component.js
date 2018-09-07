import C from 'nilavu/utils/constants';
import { get } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  intl:     service(),
  tagName: 'rio-radio',
  enable:  '',

  selectionChecker: function() {
    this.set('active', (this.get('selected') === this.get('name')));
  }.observes('activate'),

  aliasName: function(){
    return this.get('name') === C.NETWORK.PACKETMEASURETYPE.ERROR ? get(this, 'intl').t('dashboard.statistics.rx_tx') : this.get('name');
  }.property('name'),

  actions: {
    sendType() {
      this.sendAction('packetFliper', this.get('name'));
    },
  }
});
