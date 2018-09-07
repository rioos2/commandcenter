import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Component.extend({
  intl:       service(),

  maxDiskResource: function(){
    return {
      name:        'max-disk',
      suffix:      get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.suffix'),
      description: get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.description'),
      title:       get(this, 'intl').t('launcherPage.scaling.scaledown.storageCapacity.title')
    };
  }.property(),

  minDiskResource: function(){
    return {
      name:        'min-disk',
      suffix:      get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.suffix'),
      description: get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.description'),
      title:       get(this, 'intl').t('launcherPage.scaling.scaleup.storageCapacity.title')
    };
  }.property(),
});
