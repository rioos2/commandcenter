import Ember from 'ember';
const { get} = Ember;
export default Ember.Component.extend({
  intl:       Ember.inject.service(),

  maxMemoryResource: function(){
    return {
      name: "max-memory-select",
      suffix: get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.suffix'),
      title: get(this, 'intl').t('launcherPage.scaling.scaleup.ramChooser.title')
    };
  }.property(),

  minMemoryResource: function(){
    return {
      name: "min-memory-select",
      suffix: get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.suffix'),
      title: get(this, 'intl').t('launcherPage.scaling.scaledown.ramChooser.title')
      };
  }.property(),
});
