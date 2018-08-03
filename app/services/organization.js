import Ember from 'ember';
import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Service.extend(DefaultHeaders, {
  access:        Ember.inject.service(),
  'tab-session': Ember.inject.service('tab-session'),
  userStore:     Ember.inject.service('user-store'),
  store:         Ember.inject.service(),

  currentOrganization: null,
  currentTeam:         null,
  all: null,

  // Get all organizations
  getAll() {
    return this.get('store').find('origin', null, this.opts('origins'));
  },

  // Check the existence of origansation and team on session
  checkOriginAndTeamSession() {
    var tabSession = this.get('tab-session');

    return Ember.isEmpty(tabSession.get(C.TABSESSION.ORGANIZATION)) /* && Ember.isEmpty(tabSession.get(C.TABSESSION.TEAM))*/;
  },

  // Update selected organization and team to the session
  selectOrganizationAndTeam(origansation /* , team*/ ) {
    this.get('tab-session').set(C.TABSESSION.ORGANIZATION, origansation);
    this.set('currentOrganization', origansation);
    // tabSession.set(C.TABSESSION.TEAM, team);
    // this.set('currentTeam', team);
  },

  // Update selected team to the session
  selectTeam(team) {
    this.get('tab-session').set(C.TABSESSION.TEAM, team);
    this.set('currentTeam', team);
    location.reload();
  },

  // Set default organization and team if not in tab-session
  selectOrigin() {
    var self = this;

    if (this.checkOriginAndTeamSession()) {
      return this.getAll().then((all) => {
        var origansation = all.content.firstObject;

        // var team = this.get('all.items.firstObject.name');
        if (origansation.name) {
          return this.selectOrganizationAndTeam(origansation.name /* , team*/ );
        } else {
          return fail();
        }
      }).catch(() => {
        return fail();
      });
    }
    this.set('currentOrganization', this.get('tab-session').get(C.TABSESSION.ORGANIZATION));

    return this.getAll().then((all) => {
      if (all) {
        return all;
      } else {
        return fail();
      }
    }).catch(() => {
      return fail();
    });
  },

});
