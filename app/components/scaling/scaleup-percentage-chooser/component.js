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
          max: 100,
          parentThis: _this,
          suffix: get(this, 'intl').t('launcherPage.scaling.horizontal.scaleup.description'),
          title: get(this, 'intl').t('launcherPage.scaling.horizontal.scaleup.'+this.get('resource')+'.title')
      }

        renderChartRam()
            .container('#chart-scaleup-'+this.get('resource'))
            .data(data)
            // .backgroundColor('#1D1E33')
            .debug(true)
            .run();
    }
});
