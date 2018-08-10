import DefaultHeaders from 'nilavu/mixins/default-headers';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import { isEmpty } from '@ember/utils';
import { get } from '@ember/object';



export default Component.extend(DefaultHeaders, {
  intl:          service(),
  notifications: service('notification-messages'),
  session:       service(),

  actions: {

    createOrganization() {
      this.set('showSpinner', true);
      if (!this.validation()) {
        this.get('userStore').rawRequest(this.rawRequestOpts({
          url:    '/api/v1/origins',
          method: 'POST',
          data:   this.getData(),
        })).then((/* xhr*/) => {
          this.set('showSpinner', false);
          location.reload();
        }).catch((/* err*/) => {
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

    if (isEmpty(this.get('originName'))) {
      validationString = get(this, 'intl').t('nav.organization.create.orgNameEmpty');
    }
    this.set('validationWarning', validationString);

    return isEmpty(this.get('validationWarning')) ? false : true;
  },

  getData() {
    return {
      name:        this.get('originName'),
      object_meta: {
        name:    this.get('originName'),
        account: this.get('session').get('id'),
      }
    };
  },

});
