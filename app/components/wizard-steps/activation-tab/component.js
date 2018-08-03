import Ember from 'ember';

export default Ember.Component.extend({
  intl:              Ember.inject.service(),
  tagName:           'li',
  classNames:        ['smooth-disabled'],
  classNameBindings: ['active', 'tabClassName'],

  active: Ember.computed.equal('selectedTab', 'tab'),

  tabClassName: function() {
    return `wizard-steps/${  this.get('tab') }`;
  }.property('tab'),

  title: function() {
    return this.get('intl').t(`wizard.${  this.get('tab')  }.title`);
  }.property('tab'),

  isComplete: function() {
    return this.get('completedSteps').includes(this.get('tab'));
  }.property('model', 'selectedTab', 'tab', 'completedSteps'),

  _addToCollection: function() {
    this.get('panels').addObject(this.get('tabClassName'));
  }.on('didInsertElement'),

  actions: {
    select() {
      this.set('selectedTab', this.get('tab'));
    }
  }
});
