import Resource from 'ember-api-store/models/resource';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import C from 'nilavu/utils/constants';

var Secret = Resource.extend({
  type: 'secret',
  intl: service(),
  notifications: service('notification-messages'),

  validationErrors() {

    if (isEmpty(get(this, 'secret_type'))) {
      return get(this, 'intl').t('launcherPage.secret.required');
    } else {
      return '';
    }
  },
  actions: {},
});

export default Secret;
