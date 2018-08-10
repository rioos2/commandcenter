import Component from '@ember/component';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  intl:              service(),
  tagName:           'input',
  classNameBindings: ['active', 'tabClassName'],

  active: equal('selectedTab', 'tab'),

  tabClassName: function() {
    return `stacks-application-${  this.get('tab') }`;
  }.property('tab'),

});
