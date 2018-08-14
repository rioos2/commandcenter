import Component from '@ember/component';
import C from 'nilavu/utils/constants';


export default Component.extend({
  classNames:       ['container-list'],

  memberStatus: function() {
    var state = C.ORGANIZATION.MEMBER.NODEON;

    this.set('memberStyle', C.ORGANIZATION.STATE.SUCCESS);
    if (this.get('model.status') === C.ORGANIZATION.STATUS.PENDING) {
      state = C.ORGANIZATION.MEMBER.NODEOFF;
      this.set('memberStyle', C.ORGANIZATION.STATE.WARNING);
    }

    return state;
  }.property('model.status'),

  createdAt: function() {
    return this.profileTimestamp(this.get('model.object_meta.created_at'));
  }.property('model.object_meta.created_at'),

  profileTimestamp(date) {
    return moment(date).utcOffset(date).format('MMM DD, YYYY').toString();
  },

});
