import Component from '@ember/component';
import C from 'nilavu/utils/constants';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import {
  get, set, computed
} from '@ember/object';

export default Component.extend({
  intl:        service(),
  storageType: alias('stacksfactory.resources.storage_type'),


  isSelectedFlash: computed('storageType', function() {
    return get(this, 'storageType') === C.VPS.RESOURSE.SSD;
  }),

  resourceCpu: function(){
    return {
      name:        'cpu',
      description: get(this, 'intl').t('launcherPage.resource.capacity.cpu.description'),
      title:       get(this, 'intl').t('launcherPage.resource.capacity.cpu.title')
    };
  }.property(),

  resourceDisk: function(){
    return {
      name:        'disk',
      suffix:      get(this, 'intl').t('launcherPage.resource.capacity.storage.select.suffix'),
      description: get(this, 'intl').t('launcherPage.resource.capacity.storage.description'),
      title:       get(this, 'intl').t('launcherPage.resource.capacity.storage.select.title')
    };
  }.property(),

  resourceMemory: function(){
    return {
      name:   'memory',
      suffix: get(this, 'intl').t('launcherPage.resource.capacity.storage.select.suffix'),
      title:  get(this, 'intl').t('launcherPage.resource.capacity.ram.titleUpcase')

    };
  }.property(),

  actions: {
    clickFlash() {
      set(this, 'isSelectedFlash', true);
      set(this, 'storageType', C.VPS.RESOURSE.SSD);
    },
    clickHDD() {
      set(this, 'isSelectedFlash', false);
      set(this, 'storageType', C.VPS.RESOURSE.HDD);
    },
  }
});
