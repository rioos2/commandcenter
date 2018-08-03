import Ember from 'ember';

export default Ember.Component.extend({
  intl: Ember.inject.service(),
  tagName: 'li',
  classNameBindings: ['active', 'tabClassName'],

  tabClassName: function() {
    return 'organization/org-' + this.get('tab');
  }.property('tab'),

  active: Ember.computed.equal('selectedTab', 'tab'),

  title: function() {
    return this.get('intl').t('nav.organization.tab.' + this.get('tab'));
  }.property('tab'),

  _addToCollection: function() {
    this.get('panels').addObject(this.get('tabClassName'));
  }.on('didInsertElement'),

  actions: {
    select: function() {
      this.set('selectedTab', this.get('tab'));
    }
  }
});
