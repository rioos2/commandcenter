import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Component.extend({
  intl:       service(),

  maxCpuResource: function(){
    return {
      name:        'max-core-select',
      description: get(this, 'intl').t('launcherPage.scaling.scaleup.cpuChooser.description'),
      title:       get(this, 'intl').t('launcherPage.scaling.scaleup.cpuChooser.title')
    };
  }.property(),

  minCpuResource: function(){
    return {
      name:        'min-core-select',
      description: get(this, 'intl').t('launcherPage.scaling.scaledown.cpuChooser.description'),
      title:       get(this, 'intl').t('launcherPage.scaling.scaledown.cpuChooser.title')
    };
  }.property(),

});
