import Ember from 'ember';
import C from 'nilavu/utils/constants';
import { denormalizeName } from 'nilavu/utils/denormalize';
const {get} = Ember;

export default Ember.Component.extend({
  intl:       Ember.inject.service(),
  tagName: 'rio-radio',
  enable: '',

  selectionChecker: function() {
    this.set("active", (this.get("selected") == this.get("name")));
  }.observes('activate'),

  aliasName: function(){
    return this.get('name') == C.NETWORK.PACKETMEASURETYPE.ERROR ? get(this, 'intl').t('dashboard.nodeStatistics.errorAliceName') : this.get('name');
  }.property('name'),

  actions: {
    sendType() {
      this.sendAction('packetFliper', this.get('name'));
    },
  }
});
