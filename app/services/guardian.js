/**
  guardian service holds weather the logged user have origin,team and role (admin or normal user).
*/

import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { htmlSafe } from '@ember/string';

export default Service.extend(DefaultHeaders, {
  intl:          service(),
  access:        service(),
  'tab-session': service('tab-session'),
  session:       service(),
  organization:  service(),
  state:         null,


  /**
  When the user loged-in or signup we store USER_ROLES ('is_admin') in session.
  So the guardian can tell whether the user admin or not.
  */
  isAdmin() {
    return this.get('session').get(C.SESSION.USER_ROLES);
  },

  /**
   When user logged-in organization service will select first origin from the list and stored into
   the tab-session.  hasOrganization mtd can tell does user have origin
  */
  hasOrganization() {
    return !isEmpty(this.get('tab-session').get(C.TABSESSION.ORGANIZATION));
  },

  hasTeam() {
    return !isEmpty(this.get('tab-session').get(C.TABSESSION.TEAM));
  },

  hasSuspended() {
    return this.get('session').get(C.SESSION.SUSPEND);
  },
  /**
   transByAccountState update account state => structure below
   {
     'message':    msg, => it holds what message has to be displayed on bar notification
     'transition': transition, => where to transition
   }

   * "state" can be accessible any where by injecting guardian service,
   * return true if redirect needed

  */
  transByAccountState() {

    let msg, transition = '';

    switch (this.isAdmin()) {
    case true:
      if (!this.hasOrganization()) {
        msg = htmlSafe(this.get('intl').t('guardian.admin.organization.noOrigin'));
        transition = '/organization';
      } else if (!this.hasTeam()) {
        msg = htmlSafe(this.get('intl').t('guardian.admin.team.noTeam'));
        transition = `/organization/${ this.get('tab-session').get(C.TABSESSION.ORGANIZATION) }`;
      }
      break;
    case false:
      if (!this.hasOrganization() || this.hasSuspended()) {
        transition = '/account/contact-admin';
      }
      break;
    }

    this.set('state', {
      'message':    msg,
      transition
    });

    return !isEmpty(transition);
  },

});
