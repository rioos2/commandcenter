import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { equal } from '@ember/object/computed';

export default Component.extend({
  intl:              service(),
  tagName:           'li',
  classNameBindings: ['active', 'tabClassName'],

  active: equal('selectedTab', 'tab'),

  tabClassName: function() {
    return `organization/list-${  this.get('tab') }`;
  }.property('tab'),

  tabName: function() {
    return this.get('intl').t(`nav.organization.${  this.get('tab') }.name`);
  }.property('tab'),

  _addToCollection: function() {
    this.get('panels').addObject(this.get('tabClassName'));
  }.on('didInsertElement'),

  actions: {
    select() {
      this.set('selectedTab', this.get('tab'));
    }
  }
});