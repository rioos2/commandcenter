import Component from '@ember/component';
import EmberObject from '@ember/object';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import C from 'nilavu/utils/constants';
import { inject as service } from '@ember/service';
import $ from 'jquery';



export default Component.extend({
  intl:                  service(),
  organization:          service(),
  'tab-session':         service('tab-session'),
  tagName:       '',
  className:     '',

  origins:               alias('model.origins'),



  currentOrganization: computed('tab-session', 'organization.currentOrganization', function() {
    return get(this, 'tab-session').get(C.TABSESSION.ORGANIZATION);
  }),

  orgDataContents: computed('origins', function() {
    return (get(this, 'origins') === undefined) ? [] : get(this, 'origins');
  }),

  orgCount: computed('orgDataContents', function() {
    return get(this, 'orgDataContents').length;
  }),

  selectPlaceHolder: computed('orgDataContents', function() {
    return get(this, 'intl').t('nav.team.show.selectPlaceHolder');
  }),

  emptyBtnName: computed('orgDataContents', function() {
    return get(this, 'intl').t('nav.organization.show.emptyBtn');
  }),

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
