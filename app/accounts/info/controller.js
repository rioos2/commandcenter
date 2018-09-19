import C from 'nilavu/utils/constants';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { get, computed } from '@ember/object';


export default Controller.extend({
  notifications: service('notification-messages'),
  intl:          service(),
  selectedTab:   'sessions',
  panels:        [],
  modelSpinner:  false,

  profile:       alias('model.profile'),
  profileLables: alias('profile.object_meta.labels'),


  img: computed('profile.avatar', function() {
    if (get(this, 'profile.avatar') === null) {
      return 'assets/images/user/default.png';
    }

    return `data:image/png;base64,${  get(this, 'profile.avatar') }`;
  }),

  createdAt: computed('profile.created_at', function() {
    if (get(this, 'profile.created_at')) {
      return this.profileTimestamp(get(this, 'profile.created_at'));
    }

    return ' ';
  }),

  memberShip: computed('profileLables.rioos_sh_membership', function() {
    if (get(this, 'profileLables.rioos_sh_membership')) {
      return get(this, 'profileLables.rioos_sh_membership');
    }

    return C.ACCOUNT.MEMBERSHIP.MEMBERSHIPTRAIL;
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
