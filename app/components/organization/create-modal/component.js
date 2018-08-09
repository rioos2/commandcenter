import { inject as service } from '@ember/service';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import OrganizationUser from 'nilavu/mixins/organization-validation';
import Component from '@ember/component';
import { htmlSafe } from '@ember/template';
export default Component.extend(DefaultHeaders, OrganizationUser, {
  intl:          service(),
  notifications: service('notification-messages'),
  session:       service(),

  validate: function() {
    if (this.get('organizationNameValidation.failed')) {
      this.set('validationError', this.get('organizationNameValidation.reason'));

      return true;
    }
    this.set('validationError', '');

    return false;
  }.property(
    'organizationNameValidation.failed'
  ),

  actions: {

    createOrganization() {
      this.set('showSpinner', true);
      if (!this.get('validate')) {
        this.get('userStore').rawRequest(this.rawRequestOpts({
          url:    '/api/v1/origins',
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
        this.get('notifications').warning(htmlSafe(this.get('validationError')), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      }
    },

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
