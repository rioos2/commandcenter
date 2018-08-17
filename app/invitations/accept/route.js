import { inject as service } from '@ember/service';
import Router from '@ember/routing/route';
import { reject } from 'rsvp';
import { get } from '@ember/object';

export default Router.extend({
  intl:              service(),
  invitation:        service(),
  notifications: service('notification-messages'),

  model(params) {
    this.get('invitation').invitation(params.invite_id).then((res) => {
      let team = res.body.team.object_meta.name || '';

      this.get('notifications').info(get(this, 'intl').t('invitations.invitationSuccess', { teamName: team }), {
        autoClear:     true,
        clearDuration: 4200,
        cssClasses:    'notification-success'
      });
      this.transitionTo('authenticated');
    }).catch((err) => {
      this.get('notifications').warning(get(this, 'intl').t('invitations.invitationFailed'), {
        autoClear:     true,
        clearDuration: 4200,
        cssClasses:    'notification-warning'
      });

      return reject(err);
    });
  },
});
