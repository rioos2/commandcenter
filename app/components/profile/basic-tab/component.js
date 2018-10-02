import { inject as service } from '@ember/service';
import { equal } from '@ember/object/computed';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { on } from '@ember/object/evented';

export default Component.extend({
  intl:              service(),
  tagName:           'li',
  classNameBindings: ['active', 'tabClassName'],

  active: equal('selectedTab', 'tab'),


  tabClassName: computed('tab', function() {
    return `profile/${  get(this, 'tab') }`;
  }),

  title: computed('tab', function() {
    return get(this, 'intl').t(`profile.${  get(this, 'tab')  }.title`);
  }),

  iconName: computed('tab', () => {
    return `svg/svg-log`;
  }),

  _addToCollection: on('didInsertElement', function() {
    get(this, 'panels').addObject(get(this, 'tabClassName'));
  }),

});
