import Ember from 'ember';
export default Em.Component.extend({
  intl: Ember.inject.service(),
  tagName: 'li',
<<<<<<< HEAD
  classNameBindings: ['active', 'tabClassName', ':tabDisabled'],
=======
  classNameBindings: ['active','tabClassName'],
>>>>>>> origin/infra

  tabClassName: function() {
    return 'admin-infra/admin-' + this.get('tab');
  }.property('tab'),

  active: function(){
    return  this.get('selectedTab') === this.get('tab') ? true : false;
  }.property('selectedTab'),

  title: function () {
      return this.get('intl').t('stackPage.admin.' + this.get('tab') + '.title');
  }.property('tab'),

  _addToCollection: function () {
      this.get('panels').addObject(this.get('tabClassName'));
  }.on('didInsertElement'),

  actions: {
      select: function () {
          this.set('selectedTab', this.get('tab'));
        }
  }
});
