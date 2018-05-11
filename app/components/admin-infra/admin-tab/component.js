import Ember from 'ember';
export default Em.Component.extend({
  intl: Ember.inject.service(),
  tagName: 'li',
  classNameBindings: ['active','tabClassName'],

  tabClassName: function() {
    return 'admin-infra/admin-' + this.get('tab');
  }.property('tab'),

  // active: function(){
  //   return  this.get('selectedTab') === this.get('tab') ? "active" : "";
  // }.property('selectedTab'),

  active: Ember.computed.equal('selectedTab', 'tab'),

  title: function () {
      return this.get('intl').t('stackPage.admin.' + this.get('tab') + '.title');
  }.property('tab'),

  _addToCollection: function () {
      this.get('panels').addObject(this.get('tabClassName'));
  }.on('didInsertElement'),

  actions: {
      select: function () {
        alert(this.get('tab'));
          this.set('selectedTab', this.get('tab'));
      }
  }
});
