import { inject as service } from '@ember/service';
import { equal } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  intl:              service(),
  tagName:           'li',
  classNameBindings: ['active', 'tabClassName'],

  active: equal('selectedTab', 'tab'),

  tabClassName: function() {
    return `admin-infra/${  this.get('tab') }`;
  }.property('tab'),

  title: function() {
    return this.get('intl').t(`dojos.${  this.get('tab')  }.title`);
  }.property('tab'),

  iconName: function() {
    return `svg/svg-${  this.get('tab') }`;
  }.property('tab'),

  _addToCollection: function() {
    this.get('panels').addObject(this.get('tabClassName'));
  }.on('didInsertElement'),

});
