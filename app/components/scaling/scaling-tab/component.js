import Ember from 'ember';
export default Em.Component.extend({
  intl:              Ember.inject.service(),
  tagName:           'li',
  classNameBindings: ['active', 'tabClassName'],

  active: Ember.computed.equal('selectedTab', 'tab'),

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
