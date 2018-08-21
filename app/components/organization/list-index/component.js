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

  group:             alias('category'),

  currentOrganization: function() {
    return this.get('tab-session').get(C.TABSESSION.ORGANIZATION);
  }.property('tab-session', 'organization.currentOrganization'),

  orgDataContents: function() {
    return (this.get('model.origins') === undefined) ? [] : this.get('model.origins.content');
  }.property('model.origins'),


  orgCount: function() {
    return this.get('orgDataContents').length;
  }.property('orgDataContents'),

  selectPlaceHolder: function() {
    return this.get('intl').t('nav.team.show.selectPlaceHolder');
  }.property('orgDataContents'),

  emptyBtn: function() {
    return this.get('intl').t('nav.team.show.emptyBtn');
  }.property('orgDataContents'),

  actions: {

    createOrigin() {
      $('#addorigin_modal').modal('show');
    },

    doReloadInner() {
      $('#addorigin_modal').modal('hide');
      this.sendAction('reloadInner');
    },

  },

  searchParmsHash(searchSelected) {
    let states = EmberObject.create();

    states.set(C.FILTERS.QUERY_PARAM_SEARCH, searchSelected);

    return states;
  },

});
