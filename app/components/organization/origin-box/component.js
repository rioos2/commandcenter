import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import C from 'nilavu/utils/constants';

export default Component.extend({
  intl:             service(),
  router:           service(),
  'tab-session':    service('tab-session'),
  classNames:       ['container-list'],
  origin:           alias('model'),
  objectMeta:       alias('origin.object_meta'),
  createdAt:        alias('objectMeta.created_at'),
  name:             alias('objectMeta.name'),

  isSelected: computed('origin', function() {
    return (this.get('name') === this.get('currentOrigin')) ? this.get('intl').t('generic.statusSeleted') : this.get('intl').t('generic.statusNotSeleted');
  }),

  currentOrigin: computed('tab-session', function() {
    return this.get('tab-session').get(C.TABSESSION.ORGANIZATION);
  }),

});
