/* global d3 */
import Component from '@ember/component';
import { isEmpty } from '@ember/utils';

export default Component.extend({

  tagName: '',

  guageOne: function() {
    // ram
    return isEmpty(Object.keys(this.contentData())) ? this.emptyData('ram') : this.decide(this.contentData().counters[0], 'ram');
  }.property('model', 'model.counters.@each.counter'),

  guageTwo: function() {
    // cpu
    return isEmpty(Object.keys(this.contentData())) ? this.emptyData('cpu') : this.decide(this.contentData().counters[1], 'cpu');
  }.property('model', 'model.counters.@each.counter'),

  guageThree: function() {
    // disk
    return isEmpty(Object.keys(this.contentData())) ? this.emptyData('disk') : this.decide(this.contentData().counters[2], 'disk');
  }.property('model', 'model.counters.@each.counter'),

  guageFour: function() {
    // gpu
    if (!isEmpty(Object.keys(this.contentData()))) {
      if (this.contentData().counters.length > 3) {
        return this.shave(this.contentData().counters[3]);
      }
    }

    return this.emptyData('gpu');
  }.property('model', 'model.counters.@each.counter'),

  emptyData(data) {
    return {
      name:    data,
      counter: '0',
    }
  },

  contentData() {
    if (this.get('model')) {
      return this.get('model');
    }

    return {};
  },

  decide(guageValue, name) {
    return !isEmpty(guageValue.name) ? this.shave(guageValue) : this.emptyData(name);
  },

  shave(guageValue) {
    let name = guageValue.name;

    if ((guageValue.name).split('_').length > 1) {
      name = (guageValue.name).split('_')[0];
    }

    return {
      name,
      counter:     parseInt(guageValue.counter),
      description: guageValue.description,
      cpu:         guageValue.cpu,
    }

  },

});
