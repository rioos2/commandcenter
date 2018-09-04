import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import C from 'nilavu/utils/constants';

export default Component.extend({
  router:        service(),
  intl:          service(),
  'tab-session': service('tab-session'),

  classNames:    ['container-list'],
  team:          alias('model.team'),

  teamStatus: function() {
    return  (this.get('team.full_name') === this.get('currentTeam')) ? this.get('intl').t('nav.team.show.statusSeleted') : this.get('intl').t('nav.team.show.statusNotSeleted');
  }.property('team'),

  currentTeam: function() {
    return this.get('tab-session').get(C.TABSESSION.TEAM);
  }.property('tab-session'),

  createdAt: function() {
    return this.profileTimestamp(this.get('team.object_meta.created_at'));
  }.property('team.object_meta.created_at'),


  profileTimestamp(date) {
    return moment(date).utcOffset(date).format('MMM DD, YYYY').toString();
  },

});
