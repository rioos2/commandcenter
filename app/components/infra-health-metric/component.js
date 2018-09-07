/* global renderBlueGaugeChart, d3 */
import Component from '@ember/component';
import { on } from '@ember/object/evented';

export default Component.extend({
  classNames: ['gauge-chart'],
  power:      100,
  guage:      '',

  guageOne: function() {
    this.updateGuages();
  }.observes('model.counter'),

  initializeChart: on('didInsertElement', function() {

    let c_name = `.b-${  this.get('model.name') }`;

    let blue = renderBlueGaugeChart()
      .data({ value: 100 });

    d3.select(c_name).call(blue);

    let value = this.get('model.counter');

    this.set('power', value);
    blue.data({ value });

    this.set('gauge', blue);

  }),
  updateGuages() {
    let value = this.get('model.counter');

    this.set('power', value);
    this.get('gauge').data({ value });

    let id = `g-${  this.get('model.name') }`;

    self.$(`#${  id  } text`).text(`${ Math.round(value) }%`);
  },

});
