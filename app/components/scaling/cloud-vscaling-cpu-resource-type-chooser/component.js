import Ember from 'ember';
const { get } = Ember;

export default Ember.Component.extend({
  intl:       Ember.inject.service(),

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
