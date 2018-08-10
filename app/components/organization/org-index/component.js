import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import EmberObject from '@ember/object';
import { alias } from '@ember/object/computed';
import C from 'nilavu/utils/constants';



export default Component.extend({
  tagName:     '',
  className:   '',
  parentRoute: 'organization',

  group:      alias('category'),


  teamsDataContents: function() {
    return this.get('model.teams.content');
  }.property('model.teams'),

  teamsCount: function() {
    if (isEmpty(this.get('teamsDataContents'))) {
      return [].length;
    }

    return this.get('teamsDataContents').length;
  }.property('teamsDataContents'),

  actions: {

    search() {
      // //
      let parmsHash = this.searchParmsHash(this.get('searchFilter'));

      this.get('router').transitionTo(this.parentRoute, { queryParams: parmsHash });
      // //
    },

    createTeam() {
      $('#addteam_modal').modal('show');
    },

  },

  searchParmsHash(searchSelected) {
    let states = EmberObject.create();

    states.set(C.FILTERS.QUERY_PARAM_SEARCH, searchSelected);

    return states;
  },

});
