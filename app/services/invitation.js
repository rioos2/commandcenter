import DefaultHeaders from 'nilavu/mixins/default-headers';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { reject } from 'rsvp';


export default Service.extend(DefaultHeaders, {
  cookies:   service(),
  session:   service(),
  userStore: service('user-store'),

  invitation(inviteId) {
    return this.get('userStore').rawRequest(this.rawRequestOptsUsingService({
      url:    `/api/v1/invitations/${ inviteId  }/accept`,
      method: 'PUT',
    })).then((res) => {
      return res;
    }).catch((err) => {
      return reject(err);
    });
  },


});
