import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import NewOrEdit from 'nilavu/mixins/new-or-edit';
import {
  get, set, computed, observer
} from '@ember/object';


import DefaultHeaders from 'nilavu/mixins/default-headers';

import C from 'nilavu/utils/constants';


export default Component.extend(DefaultHeaders, NewOrEdit, {
  session:           service(),
  intl:              service(),
  notifications:     service('notification-messages'),
  noImage:           true,
  validationWarning: '',
  networkExist:      true,
  resourceUpdated:   false,

  domainName:     '',
  machinefactory: alias('model'),
  network:        alias('machinefactory.network'),
  objectMeta:     alias('machinefactory.object_meta'),
  clusterName:    alias('objectMeta.cluster_name'),
  resources:      alias('machinefactory.resources'),
  compute:        alias('resources.compute_type'),
  storageType:    alias('resources.storage_type'),

  groupedVms: computed('plans', function() {
    return this.groupingVms();
  }),

  isSelectedCPU: computed('compute', function() {
    return get(this, 'compute') === C.VPS.RESOURSE_COMPUTE_TYPE.CPU;
  }),

  isSelectedFlash: computed('storageType', function() {
    return get(this, 'storageType') === C.VPS.RESOURSE.SSD;
  }),

  isIPv4: computed('network', function() {
    return get(this, 'network').includes('ipv4');
  }),

  isPrivate: computed('network', function() {
    return get(this, 'network').includes('private');
  }),

  icon: computed('selectedIcon', function() {
    return get(this, 'selectedIcon');
  }),

  distroNameFromPlan: computed('machinefactory.os', function() {
    if (get(this, 'machinefactory.os') === undefined) {
      set(this, 'noImage', true);
    } else {
      set(this, 'noImage', false);
    }

    return get(this, 'machinefactory.os');
  }),


  regionExisit: computed('clusterName', function() {
    return isEmpty(get(this, 'clusterName'));
  }),

  networkExisit: computed('network', function() {
    return isEmpty(get(this, 'network'));
  }),

  imageExisit: computed('machinefactory.os', function() {
    return isEmpty(get(this, 'machinefactory.os'));
  }),

  ram: computed('resources.memory', function() {
    return this.gibFormater(get(this, 'resources.memory').toString()) + get(this, 'intl').t('launcherPage.resource.capacity.storage.select.suffix');
  }),

  storage: computed('resources.storage', function() {
    return this.gibFormater(get(this, 'resources.storage').toString()) + get(this, 'intl').t('launcherPage.resource.capacity.ram.titleUpcase');
  }),

  distroChecker: observer('machinefactory.os', function() {
    set(this, 'noImage', false);
  }),

  actions: {
    addStacksFactory() {

      var id = get(this, 'session').get('id');

      set(this, 'machinefactory.object_meta.account', id);
      if (!get(this, 'resourceUpdated')) {
        this.resourceUpdate();
        set(this, 'resourceUpdated', true);
      }
      this.send('save', (success) =>  {
        set(this, 'showSpinner', true);
        set(this, 'saving', false);
        set(this, 'saved', ( success === true ));
        if (get(this, 'saved')){
          set(this, 'filpper', 'dive');
          window.location = '/apps/stacks';
        } else {
          this.get('notifications').warning(this.get('model.error'), {
            autoClear:     true,
            clearDuration: 6000,
            cssClasses:    'notification-warning'
          });
        }
      });
    },
  },


  setResource(resource, scale) {
    if (!isEmpty(get(this, 'machinefactory.' + `${ scale }` + '.target_value.max_target_value_' + `${ resource }`)) || !isEmpty(get(this, 'machinefactory.' + `${ scale }` + '.target_value.min_target_value_' + `${ resource }`))) {
      get(this, 'machinefactory.' + `${ scale }` + '.spec.metrics').pushObject({
        metric_type: 'Resource',
        'resource':  {
          'name':             resource,
          'max_target_value': get(this, 'machinefactory.' + `${ scale }` + '.target_value.max_target_value_' + `${ resource }`).toString(),
          'min_target_value': get(this, 'machinefactory.' + `${ scale }` + '.target_value.min_target_value_' + `${ resource }`).toString(),
          'metric_time_spec': {
            'scale_up_by':   '1',
            'scale_down_by': '1'
          }
        }
      });
    }
  },

  resourceUpdate() {
    set(this, 'resources.cpu', get(this, 'resources.cpu').toString());
    set(this, 'resources.storage', get(this, 'resources.storage') + get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.suffix-i'));
    set(this, 'resources.memory', get(this, 'resources.memory') + get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.suffix-i'));
  },

  // This need to ember helper no need for hard code here
  gibFormater(data) {
    return data.replace(get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.suffix-i'), '');
  },

});
