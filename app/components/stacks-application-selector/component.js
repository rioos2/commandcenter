import Ember from 'ember';

export default Ember.Component.extend({
  intl:              Ember.inject.service(),
  tagName:           'input',
  classNameBindings: ['active', 'tabClassName'],

  active: Ember.computed.equal('selectedTab', 'tab'),

  tabClassName: function() {
    return `stacks-application-${  this.get('tab') }`;
  }.property('tab'),

});