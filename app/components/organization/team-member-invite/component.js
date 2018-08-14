import DefaultHeaders from 'nilavu/mixins/default-headers';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import { isEmpty } from '@ember/utils';
import { get } from '@ember/object';
import C from 'nilavu/utils/constants';

export default Component.extend(DefaultHeaders, {
  intl:          service(),
  notifications: service('notification-messages'),
  session:       service(),
  'tab-session':  service('tab-session'),

  actions: {

    createMember() {
      this.set('showSpinner', true);
      if (!this.validation()) {
        this.get('userStore').rawRequest(this.rawRequestOpts({
          url:    '/api/v1/teams/invitations',
          method: 'POST',
          data:   this.getData(),
        })).then(() => {
          this.set('showSpinner', false);
          location.reload();
        }).catch(() => {
          this.set('showSpinner', false);
        });
      } else {
        this.set('showSpinner', false);
        this.get('notifications').warning(htmlSafe(this.get('validationWarning')), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      }
    },

  },

  validation() {
    var validationString = '';

    if (isEmpty(this.get('memberName'))) {
      validationString = get(this, 'intl').t('nav.team.create.tmEmailEmpty');
    }
    this.set('validationWarning', validationString);

    return isEmpty(this.get('validationWarning')) ? false : true;
  },


  getData() {
    return {
      account_id:            this.get('session').get('id'),
      origin_id:          this.get('tab-session').get(C.TABSESSION.ORGANIZATION),
      team_id:               this.get('model.id'),
      users:                 [this.get('memberName')],
    };
  },

});
