import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    let _this = this;
    let initValue = this.get('initValue');
    let data = {
      value:      initValue,
      min:        1,
      max:        100,
      parentThis: _this,
      suffix:     this.get('resource.suffix'),
      title:      this.get('resource.title')
    }

    renderChartRam() // eslint-disable-line
      .container(`#chart-${  this.get('resource.name') }`)
      .data(data)
      .debug(true)
      .run()
  }
});