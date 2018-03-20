import Ember from 'ember';
import C from 'nilavu/utils/constants';

export default Ember.Component.extend({
  showLoading: false,
  tagName: 'section',
  className: '',
  group: Ember.computed.alias('category'),
  parentRoute: 'stacks',

  stacksData: function () {
    const grp = this.get('group');
    return this.get('model').filter((sd) => !Ember.isNone(sd) && sd.type === grp);
  }.property('model', 'group'),

  stacksDataContents: function () {
    const data = this.get('stacksData');
    return Ember.isEmpty(data) ? [] : data.findBy('type', this.get('group')).get('contents');
  }.property('stacksData'),

  stacksCount: function () {
    if (Ember.isEmpty(this.get('stacksDataContents'))) {
      return [].length;
    }
    return this.get('stacksDataContents').length;
  }.property('stacksDataContents'),

  searchParmsHash: function (searchSelected) {
    let states = Ember.Object.create();
    states.set(C.FILTERS.QUERY_PARAM_SEARCH, searchSelected);
    return states;
  },

  actions: {

    search() {
      ////          
      let parmsHash = this.searchParmsHash(this.get('searchFilter'));
      this.get('router').transitionTo(this.parentRoute, { queryParams: parmsHash });
      ////
    },

  },

});
