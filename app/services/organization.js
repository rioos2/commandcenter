import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { reject } from 'rsvp';

export default Service.extend(DefaultHeaders, {
  access:        service(),
  'tab-session': service('tab-session'),
  userStore:     service('user-store'),
  store:         service(),
  session:       service(),

  currentOrganization: null,
  currentTeam:         null,
  all:                 null,

  // Get all organizations
  getOriginAll() {
    return this.get('store').find('origin', null, this.opts(`origins/accounts/${ this.get('session').get('id') }`));
  },

  getTeamsByOrigin(org) {
    return this.get('store').find('team', null, this.opts(`teams/origins/${ org }`));
  },

  // Check the existence of origansation and team on session
  checkOriginAndTeamSession() {
    var tabSession = this.get('tab-session');

    return isEmpty(tabSession.get(C.TABSESSION.ORGANIZATION)) || isEmpty(tabSession.get(C.TABSESSION.TEAM));
  },

  // Update selected organization and team to the session
  selectOrganizationAndTeam(origansation, team = ''  ) {
    this.get('tab-session').set(C.TABSESSION.ORGANIZATION, origansation);
    this.set('currentOrganization', origansation);
    if (isEmpty(team)){
      this.selectTeamByOrigin(origansation).then((team) => {
        this.selectTeam(team);
      });
    }
    this.selectTeam(team);
  },

  // Get first team from organization if exisit
  selectTeam(team) {
    this.get('tab-session').set(C.TABSESSION.TEAM, team);
    this.set('currentTeam', team);
  },

  // Get first team from organization if exisit
  selectTeamByOrigin(origin) {
    return this.getTeamsByOrigin(origin).then((all) => {
      var team = !isEmpty(all.content) ? all.content.firstObject : '';

      return !isEmpty(team) ? team.team.full_name : '';
    });
  },

  // Set default organization and team if not in tab-session
  selectOrigin() {

    if (this.checkOriginAndTeamSession()) {
      return this.getOriginAll().then((all) => {
        var origansation = all.content.firstObject;

        // var team = this.get('all.items.firstObject.name');
        if (origansation.object_meta.name) {
          return this.selectOrganizationAndTeam(origansation.object_meta.name /* , team*/ );
        } else {
          return reject();
        }
      }).catch(() => {
        return reject();
      });
    }
    this.set('currentOrganization', this.get('tab-session').get(C.TABSESSION.ORGANIZATION));

    return this.getOriginAll().then((all) => {
      if (all) {
        return all;
      } else {
        return reject();
      }
    }).catch(() => {
      return reject();
    });

  },

});
