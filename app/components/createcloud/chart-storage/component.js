import Ember from 'ember';
const  {get} = Ember;

export default Ember.Component.extend({
  intl:       Ember.inject.service(),

    didInsertElement() {
        let _this = this;
        let initValue = this.get('initValue');
        let data = {
            value: initValue,
            min: 1,
            max: 1000,
            parentThis: _this,
            suffix: get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.suffix'),
            description: get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.description'),
            title: get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.title')
        }

        renderChartStorage()
            .container('#chart-storage')
            .data(data)
            .debug(true)
            .run()
    }
});
