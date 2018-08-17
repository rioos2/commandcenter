import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import EmberObject from '@ember/object';
import C from 'nilavu/utils/constants';


export default Component.extend({
  panel: [],

  parentRoute: 'stacks',

  group: alias('category'),


  filterByStatus: function() {
    return this.allFilters.find((f) => f.selector === C.FILTERS.QUERY_PARAM_STATUS);
  }.property('allFilters'),

  actions: {
    applyRule(category) {
      let parmsHash = this.filterParmsHash(category);

      this.get('router').transitionTo({ queryParams: { search: undefined } });
      this.get('router').transitionTo(this.parentRoute, { queryParams: parmsHash });
    },
  },
  // Verify if you get filter by string ubuntu first.
  filterParmsHash(category) {
    let states = EmberObject.create();
    let p = this.panel.filter((f) => f.get('group') === category);

    p.map((pn) => {
      const _initedState = pn.filterSelectionChanged();

      if (!isEmpty(_initedState)) {
        states.set(_initedState.selector, _initedState.selected);
      }
    });

    return states;

  },

  allFilters: C.FILTERS.QUERYPARM_TO_ACCESSOR_HASH,

});
