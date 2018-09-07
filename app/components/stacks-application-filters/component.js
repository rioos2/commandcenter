import Ember from 'ember';
import C from 'nilavu/utils/constants';

export default Ember.Component.extend({
    panel: [],

    group: Ember.computed.alias('category'),

    parentRoute: 'stacks',

    allFilters: C.FILTERS.QUERYPARM_TO_ACCESSOR_HASH,

    filterByOS: function () {
        return this.allFilters.find((f) => f.selector === C.FILTERS.QUERY_PARAM_OS);
    }.property('allFilters'),

    filterByLocation: function () {
        return this.allFilters.find((f) => f.selector === C.FILTERS.QUERY_PARAM_LOCATION);
    }.property('allFilters'),

    filterByDB: function () {
        return this.allFilters.find((f) => f.selector === C.FILTERS.QUERY_PARAM_DB);
    }.property('allFilters'),

    filterByStatus: function () {
        return this.allFilters.find((f) => f.selector === C.FILTERS.QUERY_PARAM_STATUS);
    }.property('allFilters'),

    filterByNetwork: function () {
        return this.allFilters.find((f) => f.selector === C.FILTERS.QUERY_PARAM_NETWORK);
    }.property('allFilters'),

    //Verify if you get filter by string ubuntu first.
    filterParmsHash: function (category) {
        let states = Ember.Object.create();
        let p = this.panel.filter((f) => f.get('group') === category);

        p.map(function (pn) {
            const _initedState = pn.filterSelectionChanged();
            if (!Ember.isEmpty(_initedState)) {
                states.set(_initedState.selector, _initedState.selected);
            }
        });

        return states;

    },

    actions: {
        applyRule: function (category) {
            let parmsHash = this.filterParmsHash(category);
            this.get('router').transitionTo({queryParams: {search: undefined}});
            this.get('router').transitionTo(this.parentRoute, { queryParams: parmsHash });
        },
    }
});
