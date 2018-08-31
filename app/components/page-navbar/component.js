import Component from '@ember/component';
import C from 'nilavu/utils/constants';
import {  inject as service } from '@ember/service';

export default Component.extend({
  access:        service(),
  organization:  service(),
  'tab-session': service('tab-session'),


  selector: null,

  email: function() {
    return this.get('session.email');
  }.property('session'),

  isAdmin: function() {
    return this.get('session').get(C.SESSION.USER_ROLES);
  }.property('guardian'),

  currentOrganization: function() {
    return this.get('organization.currentOrganization');
  }.property('organization.currentOrganization'),

  currentTeam: function() {
    return this.get('tab-session').get(C.TABSESSION.TEAM);
  }.property('tab-session', 'organization.currentOrganization'),

  actions: {
    logout() {
      this.get('access').sessionClearRequest();
    },

    switchOrigin(org) {
      this.sendAction('switchOrganization', org);
    },
  }
});
