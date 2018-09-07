import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    let _this = this;
    let initValue = this.get('initValue');
    let data = {
      value:       initValue,
      min:         1,
      max:         1000,
      parentThis:  _this,
      suffix:      this.get('resource.suffix'),
      description: this.get('resource.description'),
      title:       this.get('resource.title')
    }

    renderChartStorage() // eslint-disable-line
      .container(`#chart-${ this.get('resource.name') }`)
      .data(data)
      .debug(true)
      .run()
  }
});
