import Ember from 'ember';

export default Ember.Component.extend({
  intl: Ember.inject.service(),
  tagName: 'input',
  classNameBindings: ['active', 'tabClassName'],

  tabClassName: function () {
    return 'stacks-application-' + this.get('tab');
  }.property('tab'),

  active: Ember.computed.equal('selectedTab', 'tab')

});