import Component from '@ember/component';
import EmberObject from '@ember/object';
import { alias } from '@ember/object/computed';
import C from 'nilavu/utils/constants';
import { inject as service } from '@ember/service';
import $ from 'jquery';



export default Component.extend({
  intl:          service(),


  tagName:     '',
  className:   '',
  parentRoute: 'organization',

  group:             alias('category'),
  teamsDataContents: function() {
    return (this.get('model.teams') === undefined) ? [] : this.get('model.teams.content');
  }.property('model.teams'),

  teamsCount: function() {
    return this.get('teamsDataContents').length;
  }.property('teamsDataContents'),

  emptyBtn: function() {
    return this.get('intl').t('nav.team.show.emptyBtn');
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
