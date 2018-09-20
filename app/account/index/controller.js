import C from 'nilavu/utils/constants';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { get, computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default Controller.extend({
  notifications: service('notification-messages'),
  intl:          service(),
  selectedTab:   'recent-activity',
  panels:        [],

  profile:       alias('model.profile'),
  profileLables: alias('profile.object_meta.labels'),

  avatar: computed('profile.avatar', function() {
    const myPicture = get(this, 'profile.avatar');

    if (isEmpty(myPicture)) {
      return 'assets/images/user/default.png';
    }

    return `data:image/png;base64,${  myPicture }`;
  }),


  createdAt: computed('profile.object_meta.created_at', function() {
    if (get(this, 'profile.object_meta.created_at')) {
      return this.profileTimestamp(get(this, 'profile.object_meta.created_at'));
    }

    return ' ';
  }),

  // createdAt: computed('profile.object_meta.created_at', function() {
  //   return get(this, 'profile.object_meta.created_at');
  // }),

  myAuthority: computed('profile.is_admin', function() {
    return get(this, 'profile.is_admin') ? C.ACCOUNT.AUTHORITY_AS_STRING.ADMIN : C.ACCOUNT.AUTHORITY_AS_STRING.NOT_ADMIN;
  }),


  memberShipStatus: computed('profileLables.rioos_sh_membership_status', function() {
    if (get(this, 'profileLables.rioos_sh_membership_status')) {
      return get(this, 'profileLables.rioos_sh_membership_status');
    }

    return C.ACCOUNT.MEMBERSHIPSTATUS.MEMBERSHIPSTATUSREGISTERED;
  }),

  profileTimestamp(date) {
    return moment(date).utcOffset(date).format('MMM DD, YYYY').toString();
  },

});
