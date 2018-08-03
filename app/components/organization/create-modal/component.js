import Ember from 'ember';
const { get } = Ember;

import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
export default Ember.Component.extend(DefaultHeaders, {
  intl:          Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  session:       Ember.inject.service(),

  actions: {

    createOrganization() {
      this.set('showSpinner', true);
      if (!this.validation()) {
        this.get('userStore').rawRequest(this.rawRequestOpts({
          url:    '/api/v1/origins',
          method: 'POST',
          data:   this.getData(),
        })).then((xhr) => {
          this.set('showSpinner', false);
          location.reload();
        }).catch((err) => {
          this.set('showSpinner', false);
        });
      } else {
        this.set('showSpinner', false);
        this.get('notifications').warning(Ember.String.htmlSafe(this.get('validationWarning')), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      }
    },

  },

  validation() {
    var validationString = '';

    if (Ember.isEmpty(this.get('originName'))) {
      validationString = get(this, 'intl').t('nav.organization.create.orgNameEmpty');
    }
    this.set('validationWarning', validationString);

    return Ember.isEmpty(this.get('validationWarning')) ? false : true;
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
