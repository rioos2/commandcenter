import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import C from 'nilavu/utils/constants';
import { computed } from '@ember/object';

export default Component.extend({
  router:        service(),
  intl:          service(),
  'tab-session': service('tab-session'),

  classNames:    ['container-list'],
  team:          alias('model.team'),
  fullName:      alias('team.full_name'),
  objectMeta:    alias('team.object_meta'),

  createdAt:     alias('objectMeta.created_at'),

  isSelected: computed('team', function() {
    return  (this.get('fullName') === this.get('currentTeam')) ? this.get('intl').t('nav.team.show.statusSeleted') : this.get('intl').t('nav.team.show.statusNotSeleted');
  }),

  currentTeam: computed('tab-session', function() {
    return this.get('tab-session').get(C.TABSESSION.TEAM);
  }),

  hoursAgo: computed('createdAt', function() {
    const date = this.get('createdAt');

    return moment(this.get(date)).utcOffset(date).format('MMM DD, YYYY').toString();

  }),

});
