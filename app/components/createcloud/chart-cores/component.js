import Component from '@ember/component';

export default Component.extend({

  didInsertElement() {
    let _this = this;
    let initvalue = parseInt(this.get('initValue'));
    let data = {
      value:       initvalue,
      min:         1,
      max:         30,
      parentThis:  _this,
      description: this.get('resource.description'),
      title:       this.get('resource.title')
    }

    renderChartNumberOfCores()
      .container(`#chart-cores-${ this.get('resource.name') }`)
      .data(data)
    // .backgroundColor('#1D1E33')
      .debug(true)
      .run();
  }
});
