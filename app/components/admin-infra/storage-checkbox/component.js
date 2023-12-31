import Ember from 'ember';
const {
  get
} = Ember;
import C from 'nilavu/utils/constants';

export default Ember.Component.extend({
  tagName: 'rio-radio',
  active: false,
  intl: Ember.inject.service(),


  enabler: function() {
    return ((this.get('type') == C.ADMIN.STORAGE_TYPE.CEPH) && (Ember.isEmpty(this.get('disk.point')) && this.get('disk.type') == "disk")) ? "" : ((Ember.isEmpty(this.get('disk.point')) && this.get('type') != C.ADMIN.STORAGE_TYPE.CEPH) ? "" : 'disabled');
  }.property('disk', 'type'),

  errorMsg: function() {
    return !this.get('enabler') ? "" : get(this, 'intl').t('stackPage.admin.storage.pool.diskChooseMsg');
  }.property('enabler'),

  actions: {
    sendType() {
      this.toggleProperty('active');
      this.sendAction('updatePoolData', this.get('active'), this.get('disk.disk'));
    },
  }
});
