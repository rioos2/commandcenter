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
    return  (this.get('fullName') === this.get('currentTeam')) ? this.get('intl').t('generic.statusSeleted') : this.get('intl').t('generic.statusNotSeleted');
  }),

  currentTeam: computed('tab-session', function() {
    return this.get('tab-session').get(C.TABSESSION.TEAM);
  }),

});
