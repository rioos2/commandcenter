import Component from '@ember/component';
import EmberObject from '@ember/object';
import { alias } from '@ember/object/computed';
import C from 'nilavu/utils/constants';
import { inject as service } from '@ember/service';
import $ from 'jquery';



export default Component.extend({
  intl:                  service(),
  organization:          service(),
  'tab-session':         service('tab-session'),



  tagName:     '',
  className:   '',
  parentRoute: 'organization',

  group:             alias('category'),

  currentTeam: function() {
    return this.get('tab-session').get(C.TABSESSION.TEAM);
  }.property('tab-session', 'organization.currentOrganization'),

  teamsDataContents: function() {
    return (this.get('model.teams') === undefined) ? [] : this.get('model.teams.content');
  }.property('model.teams'),

  teamsName: function() {
    return this.get('teamsDataContents').map((t) => {
      return t.team.full_name;
    });
  }.property('teamsDataContents'),

  teamsCount: function() {
    return this.get('teamsDataContents').length;
  }.property('teamsDataContents'),

  selectPlaceHolder: function() {
    return this.get('intl').t('nav.team.show.selectPlaceHolder');
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

    doReloadInner() {
      $('#addteam_modal').modal('hide');
      this.sendAction('reloadInner');
    },

    selectTeam(team) {
      this.get('organization').selectOrganizationAndTeam(this.get('currentOrigin'), team);
      location.reload();
    },

  },

  searchParmsHash(searchSelected) {
    let states = EmberObject.create();

    states.set(C.FILTERS.QUERY_PARAM_SEARCH, searchSelected);

    return states;
  },

});
