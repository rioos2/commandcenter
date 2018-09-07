import Component from '@ember/component';
import C from 'nilavu/utils/constants';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Component.extend({
  intl:        service(),
  storageType: alias('model.stacksfactory.resources.storage_type'),

  isSelectedFlash: function() {
    return this.get('storageType') === C.VPS.RESOURSE.SSD;
  }.property('storageType'),

  resourceCpu: function(){
    return {
      name:        'cpu',
      description: get(this, 'intl').t('launcherPage.sysConfig.cpuChooser.description'),
      title:       get(this, 'intl').t('launcherPage.sysConfig.cpuChooser.title')
    };
  }.property(),

  resourceDisk: function(){
    return {
      name:        'disk',
      suffix:      get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.suffix'),
      description: get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.description'),
      title:       get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.title')
    };
  }.property(),

  resourceMemory: function(){
    return {
      name:   'memory',
      suffix: get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.suffix'),
      title:  get(this, 'intl').t('launcherPage.sysConfig.ramChooser.title')
    };
  }.property(),

  actions: {
    clickFlash() {
      this.set('isSelectedFlash', true);
      this.set('storageType', C.VPS.RESOURSE.SSD);
    },
    clickHDD() {
      this.set('isSelectedFlash', false);
      this.set('storageType', C.VPS.RESOURSE.HDD);
    },
  }
});
