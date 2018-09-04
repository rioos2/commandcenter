import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { reject } from 'rsvp';
import { later } from '@ember/runloop';

export default Service.extend(DefaultHeaders, {
  access:        service(),
  'tab-session': service('tab-session'),
  userStore:     service('user-store'),
  store:         service(),
  session:       service(),

  currentOrganization:       null,
  currentTeam:               null,
  currentTeamId:             null,
  all:                       null,
  waitAndChangeOrganization: null,

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
  orgnizationChanged(origansation, team = {}  ) {
    this.get('tab-session').set(C.TABSESSION.ORGANIZATION, origansation);
    this.set('currentOrganization', origansation);
    if ($.isEmptyObject(team)){
      this.teamsByOrigin(origansation).then((team) => {
        this.teamChanged(team);
      });
    }
    this.teamChanged(team);
  },

  // Get first team from organization if exisit
  teamChanged(team) {
    this.set('waitAndChangeOrganization', later(() => {
      this.get('tab-session').set(C.TABSESSION.TEAM, team.team.full_name);
      this.get('tab-session').set(C.TABSESSION.TEAMID, team.team.id);
      this.set('currentTeam', team.team.full_name);
      this.set('currentTeamId', team.team.id);
    }, 1500));
  },

  // Get first team from organization if exisit
  teamsByOrigin(origin) {
    return this.getTeamsByOrigin(origin).then((all) => {
      return !isEmpty(all.content) ? all.content.firstObject : {};
    });
  },

  // Set default organization and team if not in tab-session
  selectOrigin() {

    if (this.checkOriginAndTeamSession()) {
      return this.getOriginAll().then((all) => {
        var origansation = all.content.firstObject;

        // var team = this.get('all.items.firstObject.name');
        if (origansation.object_meta.name) {
          return this.orgnizationChanged(origansation.object_meta.name /* , team*/ );
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
