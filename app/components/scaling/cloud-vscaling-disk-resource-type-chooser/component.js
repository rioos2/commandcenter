import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Component.extend({
  intl:       service(),

  maxDiskResource: function(){
    return {
      name:        'max-disk',
      suffix:      get(this, 'intl').t('launcherPage.resource.capacity.storage.select.suffix'),
      description: get(this, 'intl').t('launcherPage.resource.capacity.storage.select.suffix'),
      title:       get(this, 'intl').t('launcherPage.scaling.down.storage.limit')
    };
  }.property(),

  minDiskResource: function(){
    return {
      name:        'min-disk',
      suffix:      get(this, 'intl').t('launcherPage.resource.capacity.storage.select.suffix'),
      description: get(this, 'intl').t('launcherPage.resource.capacity.storage.select.suffix'),
      title:       get(this, 'intl').t('launcherPage.scaling.up.storage.limit')
    };
  }.property(),
});
