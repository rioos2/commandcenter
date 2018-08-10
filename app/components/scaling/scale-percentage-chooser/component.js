import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  intl:       service(),

  didInsertElement() {
    let _this = this;
    let initvalue = parseInt(this.get('initValue'));
    let data = {
      value:      initvalue,
      min:        1,
      max:        100,
      parentThis: _this,
      suffix:     this.get('resource.suffix'),
      title:      this.get('resource.title')
    }
    //     suffix: get(this, 'intl').t('launcherPage.scaling.horizontal.scaleup.description'),
    //     title: get(this, 'intl').t('launcherPage.scaling.horizontal.scaleup.'+this.get('resource')+'.title')

    renderChartRam()
      .container(`#${ this.get('resource.name') }${ this.get('scaleType') }`)
      .data(data)
    // .backgroundColor('#1D1E33')
      .debug(true)
      .run();
  }
});
