import Resource from 'ember-api-store/models/resource';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import C from 'nilavu/utils/constants';


var MachineFactory = Resource.extend({

  type:          'machinefactory',
  intl:              service(),
  notifications:     service('notification-messages'),

  // Will be fired when the resoure get saving
  validationErrors() {
    if (isEmpty(get(this, 'secret.id')) && get(this, 'object_meta.labels.rioos_category') !== C.CATEGORIES.BLOCKCHAIN) {
      return  get(this, 'intl').t('launcherPage.secret.required');
    }  else if (isEmpty(get(this, 'object_meta.cluster_name'))) {
      return  get(this, 'intl').t('launcherPage.location.required');
    } else if (isEmpty(get(this, 'os'))) {
      return  get(this, 'intl').t('launcherPage.appstore.machine.required');
    } else if (isEmpty(get(this, 'network'))) {
      return  get(this, 'intl').t('launcherPage.network.required');
    } else {
      return '';
    }
  },

  actions: {},
});

export default MachineFactory;
