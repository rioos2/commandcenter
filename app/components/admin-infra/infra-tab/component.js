import Ember from 'ember';
export default Em.Component.extend({
  intl: Ember.inject.service(),
  tagName: 'li',
  classNameBindings: ['active', 'tabClassName'],

  tabClassName: function() {
    return 'admin-infra/' + this.get('tab');
  }.property('tab'),

  active: Ember.computed.equal('selectedTab', 'tab'),

  title: function () {
      return this.get('intl').t('stackPage.admin.' + this.get('tab') + '.title');
  }.property('tab'),

  iconName: function() {
    return 'svg/svg-' + this.get('tab');
  }.property('tab'),

  _addToCollection: function () {
      this.get('panels').addObject(this.get('tabClassName'));
  }.on('didInsertElement'),

});
