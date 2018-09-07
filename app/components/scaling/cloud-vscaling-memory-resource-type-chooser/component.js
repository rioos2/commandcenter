import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Component.extend({
  intl:       service(),

  maxMemoryResource: function(){
    return {
      name:   'max-memory-select',
      suffix: get(this, 'intl').t('launcherPage.resource.capacity.storage.select.suffix'),
      title:  get(this, 'intl').t('launcherPage.scaling.up.memory.limit')
    };
  }.property(),

  minMemoryResource: function(){
    return {
      name:   'min-memory-select',
      suffix: get(this, 'intl').t('launcherPage.resource.capacity.storage.select.suffix'),
      title:  get(this, 'intl').t('launcherPage.scaling.down.memory.limit')
    };
  }.property(),
});
