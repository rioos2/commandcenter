import Component from '@ember/component';
import {  inject as service } from '@ember/service';
import C from 'nilavu/utils/constants';

export default Component.extend({
  access:        service(),
  organization: service(),

  selector: null,

  email: function() {
    return this.get('session.email');
  }.property('session'),

  currentOrganization: function() {
    return this.get('organization.currentOrganization');
  }.property('organization.currentOrganization'),

  actions: {
    logout() {
      this.get('access').sessionClearRequest();
    },

    switchOrigin(org) {
      this.sendAction('switchOrganization', org);
    },

    createOrganization: function() {
      $('#addorigin_modal').modal('show');
    }
  }
});
