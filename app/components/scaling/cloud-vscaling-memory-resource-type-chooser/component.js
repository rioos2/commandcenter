import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Component.extend({
  intl:       service(),

  maxMemoryResource: function(){
    return {
      name:   'max-memory-select',
      suffix: get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.suffix'),
      title:  get(this, 'intl').t('launcherPage.scaling.scaleup.ramChooser.title')
    };
  }.property(),

  minMemoryResource: function(){
    return {
      name:   'min-memory-select',
      suffix: get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.suffix'),
      title:  get(this, 'intl').t('launcherPage.scaling.scaledown.ramChooser.title')
    };
  }.property(),
});
