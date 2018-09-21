import Component from '@ember/component';
import C from 'nilavu/utils/constants';
import { alias } from '@ember/object/computed';

export default Component.extend({
  classNames:       ['container-list'],
  member:           alias('model'),
  memberObjectMeta: alias('member.object_meta'),
  createdAt:        alias('memberObjectMeta.created_at'),

  memberStatus: function() {
    var state = C.ORGANIZATION.MEMBER.MEMBERACTIVE;

    this.set('memberStyle', C.ORGANIZATION.STATE.SUCCESS);
    if (this.get('member.status') === C.ORGANIZATION.STATUS.PENDING) {
      state = C.ORGANIZATION.MEMBER.MEMBERINACTIVE;
      this.set('memberStyle', C.ORGANIZATION.STATE.WARNING);
    }

    return state;
  }.property('member.status'),

});
