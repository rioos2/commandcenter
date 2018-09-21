import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  intl:              service(),
  tagName:           'li',
  classNameBindings: ['active', 'tabClassName', ':tabDisabled'],

  tabClassName: function() {
    return `dojos/infrastructure/${  this.get('tab') }`;
  }.property('tab'),

  active: function(){
    return  this.get('selectedTab') === this.get('tab') ? true : false;
  }.property('selectedTab'),

  title: function() {
    return this.get('intl').t(`dojos.infrastructure.${  this.get('tab')  }.title`);
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
