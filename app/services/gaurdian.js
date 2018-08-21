import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Service.extend(DefaultHeaders, {
  access:        service(),
  'tab-session': service('tab-session'),
  session:       service(),
  organization:  service(),


  // Get all organizations
  // TODO get is_admin from roles. roles data needs to be updated on api_gateway
  isAdmin() {
    return this.get('session').get(C.SESSION.USER_ROLES).is_admin;
  },

  hasOrganization() {
    return !isEmpty(this.get('organization').get('currentOrganization'));
  },

  hasTeam() {
    return !isEmpty(this.get('organization').get('currentTeam'));
  },

});
