/* global d3 */
import Component from '@ember/component';
import HealthGauges from 'nilavu/utils/health_gauges';
import C from 'nilavu/utils/constants';

export default Component.extend({

  tagName: '',

  showCounters: [],

  builtIns: function() {
    return this.get('showCounters');
  }.property('model', 'model.counters.@each.counter'),

  init() {
    this._super(...arguments);

    const model = this.get('model');

    const props = C.BUILTIN_BASIC_GAUGES;

    const hg = HealthGauges.create({
      model,
      props
    });

    this.set('showCounters', hg.show);
  },


});



