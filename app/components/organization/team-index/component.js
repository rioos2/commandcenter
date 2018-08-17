import Component from '@ember/component';
import EmberObject from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import C from 'nilavu/utils/constants';
import $ from 'jquery';


export default Component.extend({
  intl:          service(),
  tagName:     '',
  className:   '',
  parentRoute: 'organization',

  group:      alias('category'),
  members:     alias('model.team.members'),

  memberDataContents: function() {
    return (this.get('members') === null) ? [] : this.get('members');
  }.property('members'),

  emptyBtn: function() {
    return this.get('intl').t('nav.team.member.emptyBtn');
  }.property('memberDataContents'),

  memberCount: function() {


    return this.get('memberDataContents').length;
  }.property('memberDataContents'),

  didInsertElement() {
    this.set('team', this.get('model.team.full_name'));
  },

  actions: {

    search() {
      // //
      let parmsHash = this.searchParmsHash(this.get('searchFilter'));

      this.get('router').transitionTo(this.parentRoute, { queryParams: parmsHash });
      // //
    },

    inviteMember() {
      $('#invitemember_modal').modal('show');
    },

  },

  searchParmsHash(searchSelected) {
    let states = EmberObject.create();

    states.set(C.FILTERS.QUERY_PARAM_SEARCH, searchSelected);

    return states;
  },

});
