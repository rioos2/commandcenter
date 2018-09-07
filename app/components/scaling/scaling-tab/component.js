import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { equal } from '@ember/object/computed';

export default Component.extend({
  intl:              service(),
  tagName:           'li',
  classNameBindings: ['active', 'tabClassName'],

  active: equal('selectedTab', 'tab'),

  tabClassName: function() {
    return `scaling/select-scaling-${  this.get('tab') }`;
  }.property('tab'),

  title: function() {
    return this.get('intl').t(`launcherPage.scaling.horizontal.${  this.get('tab')  }.title`);
  }.property('tab'),

  iconName: function() {
    return `svg/svg-${  this.get('tab') }`;
  }.property('tab'),

  _addToCollection: function() {
    this.get('panels').addObject(this.get('tabClassName'));
  }.on('didInsertElement'),

});
