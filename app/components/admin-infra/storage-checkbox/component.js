import { get } from '@ember/object';
import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';

import C from 'nilavu/utils/constants';

export default Component.extend({
  intl: service(),


  tagName: 'rio-radio',
  active:  false,
  enabler: function() {
    return ((this.get('type') === C.NODE.STORAGE_TYPE.CEPH) && (isEmpty(this.get('disk.point')) && this.get('disk.type') === 'disk')) ? '' : ((isEmpty(this.get('disk.point')) && this.get('type') !== C.NODE.STORAGE_TYPE.CEPH) ? '' : 'disabled');
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
