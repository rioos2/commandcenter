import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Component.extend({
  intl:       service(),

  maxCpuResource: function(){
    return {
      name:        'max-core-select',
      description: get(this, 'intl').t('launcherPage.scaling.up.cpu.title'),
      title:       get(this, 'intl').t('launcherPage.scaling.up.cpu.limit')
    };
  }.property(),

  minCpuResource: function(){
    return {
      name:        'min-core-select',
      description: get(this, 'intl').t('launcherPage.scaling.down.cpu.title'),
      title:       get(this, 'intl').t('launcherPage.scaling.down.cpu.limit')
    };
  }.property(),

});
