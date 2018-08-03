import Ember from 'ember';

export default Ember.Component.extend({
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

    renderChartRam()
      .container(`#chart-${  this.get('resource.name') }`)
      .data(data)
      .debug(true)
      .run()
  }
});
