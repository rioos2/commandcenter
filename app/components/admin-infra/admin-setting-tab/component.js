import Ember from 'ember';
export default Em.Component.extend({
  intl:              Ember.inject.service(),
  tagName:           'li',
  classNameBindings: ['active', 'tabClassName', ':tabDisabled'],

  tabClassName: function() {
    return `admin-infra/${  this.get('tab') }`;
  }.property('tab'),

  active: function(){
    return  this.get('selectedTab') === this.get('tab') ? true : false;
  }.property('selectedTab'),

  title: function() {
    return this.get('intl').t(`stackPage.admin.settings.${  this.get('tab')  }.title`);
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
