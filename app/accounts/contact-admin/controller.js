import { get } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';

export default Controller.extend({
  intl: service(),

  tagName:   'section',
  className: '',

  msg: function() {
    return htmlSafe(get(this, 'intl').t('guardian.regular.organization.noOrigin'));
  }.property(''),

  inviteMsg: function() {
    return htmlSafe(get(this, 'intl').t('guardian.regular.organization.acceptOrigin'));
  }.property(''),

  inviteAcceptMsg: function() {
    return htmlSafe(get(this, 'intl').t('guardian.regular.organization.acceptText', {
      accountName: this.get('model.invitation.invite_from'),
      orgName:      this.get('model.invitation.origin_id'),
      teamName:     this.get('model.invitation.team_id')
    }));
  }.property(''),

  actions: {
    accept() {
      // Clear the cache so it has to ask the server again
      this.transitionToRoute(`/invitations/${  this.get('model.invitation.id') }/accept`);
    },
  },

});
