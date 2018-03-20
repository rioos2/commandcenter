import Ember from 'ember';
const  {get} = Ember;


export default Ember.Component.extend({
  intl:       Ember.inject.service(),

    didInsertElement() {
        let _this = this;
        let initvalue = this.get('initValue');
        let data = {
            value: initvalue,
            min: 1,
            max: 30,
            parentThis: _this,
            description: get(this, 'intl').t('launcherPage.sysConfig.cpuChooser.description'),
            title: get(this, 'intl').t('launcherPage.sysConfig.cpuChooser.title')
        }

        renderChartNumberOfCores()
            .container('#chart-cores')
            .data(data)
            // .backgroundColor('#1D1E33')
            .debug(true)
            .run();
    }
});
