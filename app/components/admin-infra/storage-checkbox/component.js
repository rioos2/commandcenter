import Ember from 'ember';
const { get } = Ember;

import C from 'nilavu/utils/constants';

export default Ember.Component.extend({
  intl: Ember.inject.service(),


  tagName: 'rio-radio',
  active:  false,
  enabler: function() {
    return ((this.get('type') == C.NODE.STORAGE_TYPE.CEPH) && (Ember.isEmpty(this.get('disk.point')) && this.get('disk.type') == 'disk')) ? '' : ((Ember.isEmpty(this.get('disk.point')) && this.get('type') != C.NODE.STORAGE_TYPE.CEPH) ? '' : 'disabled');
  }.property('disk', 'type'),

  errorMsg: function() {
    return !this.get('enabler') ? '' : get(this, 'intl').t('stackPage.admin.storage.pool.diskChooseMsg');
  }.property('enabler'),

  actions: {
    sendType() {
      this.toggleProperty('active');
      this.sendAction('updatePoolData', this.get('active'), this.get('disk.disk'));
    },
  }
});
