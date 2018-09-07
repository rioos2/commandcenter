import Ember from 'ember';
export default Ember.Component.extend({
  maxCpuResource: function(){
    return {
      name: "hscaling-max-cpu",
      suffix: get(this, 'intl').t('launcherPage.scaling.horizontal.scaledown.description'),
      title: get(this, 'intl').t('launcherPage.scaling.horizontal.scaledown.description')
    };
  },
});
