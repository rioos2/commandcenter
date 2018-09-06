import Component from '@ember/component';
import C from 'nilavu/utils/constants';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Component.extend({
  classNames:       ['container-list'],
  user:          alias('model'),
  objectMeta:       alias('user.object_meta'),

  memberStatus: computed('user.suspend', function() {
    var state = C.ORGANIZATION.MEMBER.MEMBERACTIVE;

    this.set('memberStyle', C.ORGANIZATION.STATE.SUCCESS);
    if (this.get('user.suspend')) {
      state = C.ORGANIZATION.MEMBER.MEMBERINACTIVE;
      this.set('memberStyle', C.ORGANIZATION.STATE.WARNING);
    }

    return state;
  }),

  createdAt: computed('objectMeta.created_at', function() {
    const date = this.get('objectMeta.created_at');

    return moment(date).utcOffset(date).format('MMM DD, YYYY').toString();
  }),

});
