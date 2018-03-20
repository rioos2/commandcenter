import Ember from 'ember';

const {
  get
} = Ember;
export default Ember.Component.extend({
  intl: Ember.inject.service(),

  didInsertElement() {
    let _this = this;
    let initValue = this.get('initValue');
    let data = {
      value: initValue,
      min: 1,
      max: 100,
      parentThis: _this,
      suffix: get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.suffix'),
      title: get(this, 'intl').t('launcherPage.sysConfig.ramChooser.title')
    }

    renderChartRam()
      .container('#chart-ram')
      .data(data)
      .debug(true)
      .run()
  }
});
