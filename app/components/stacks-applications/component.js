import Component from '@ember/component';
import C from 'nilavu/utils/constants';
import { alias } from '@ember/object/computed';
import { isNone } from '@ember/utils';
import { isEmpty } from '@ember/utils';
import EmberObject from '@ember/object';

export default Component.extend({
  tagName:     'section',
  className:   '',
  parentRoute: 'stacks',

  group:      alias('category'),
  stacksData: function() {
    const grp = this.get('group');

    return this.get('model').filter((sd) => !isNone(sd) && sd.type === grp);
  }.property('model', 'group'),

  stacksDataContents: function() {
    const data = this.get('stacksData');

    return isEmpty(data) ? [] : data.findBy('type', this.get('group')).get('contents');
  }.property('stacksData'),

  stacksCount: function() {
    if (isEmpty(this.get('stacksDataContents'))) {
      return [].length;
    }

    return this.get('stacksDataContents').length;
  }.property('stacksDataContents'),

  actions: {

    search() {
      // //
      let parmsHash = this.searchParmsHash(this.get('searchFilter'));

      this.get('router').transitionTo(this.parentRoute, { queryParams: parmsHash });
      // //
    },

  },

  searchParmsHash(searchSelected) {
    let states = EmberObject.create();

    states.set(C.FILTERS.QUERY_PARAM_SEARCH, searchSelected);

    return states;
  },

});
