import Ember from 'ember';
const { get } = Ember;

export default Ember.Component.extend({
  intl:       Ember.inject.service(),

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
