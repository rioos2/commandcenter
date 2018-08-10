import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({
  maxCpuResource(){
    return {
      name:   'hscaling-max-cpu',
      suffix: get(this, 'intl').t('launcherPage.scaling.horizontal.scaledown.description'),
      title:  get(this, 'intl').t('launcherPage.scaling.horizontal.scaledown.description')
    };
  },
});
