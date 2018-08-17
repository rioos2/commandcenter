import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { equal } from '@ember/object/computed';


export default Component.extend({
  intl:              service(),
  tagName:           'li',
  classNameBindings: ['active', 'tabClassName'],

  active: equal('selectedTab', 'tab'),

  tabClassName: function() {
    return `organization/team-${  this.get('tab') }`;
  }.property('tab'),


  _addToCollection: function() {
    this.get('panels').addObject(this.get('tabClassName'));
  }.on('didInsertElement'),

  actions: {
    select() {
      this.set('selectedTab', this.get('tab'));
    },

    redirect() {
      this.get('router').transitionTo(`/organization/${  this.get('currentOrigin') }`);
    }
  }
});
