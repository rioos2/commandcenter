/* global renderBlueGaugeChart, d3, particlesJS */
import Component from '@ember/component';
import Ember from 'ember';

export default Component.extend({

  tagName: '',

  guageUpdate: function() {
    this.update();
  }.observes('model'),


  guageOne: function() {
    //ram
    return Ember.isEmpty(Object.keys(this.contentData())) ? "0": this.shave(this.contentData().results.guages.counters[0]);
  }.property('model.content'),
  guageTwo: function() {
    //cpu
    return Ember.isEmpty(Object.keys(this.contentData()))? "0" : this.shave(this.contentData().results.guages.counters[1]);
  }.property('model.content'),
  guageThree: function() {
    //disk
    return Ember.isEmpty(Object.keys(this.contentData()))? "0" : this.shave(this.contentData().results.guages.counters[2]);
  }.property('model.content'),
  guageFour: function() {
    //gpu
    if(!Ember.isEmpty(Object.keys(this.contentData()))){
    if (this.contentData().results.guages.counters.length > 3) {
      return this.shave(this.contentData().results.guages.counters[3]);
    }
  }
    return this.emptyGpu();
  }.property('model.content'),

  emptyGpu: function() {
    return {
      name: "gpu",
      counter: "0",
    }
  },

  contentData: function() {
    if(this.get('model.content').length>0){
    return this.get('model.content').objectAt(0);
    }
    return {};
  },

  shave: function(guageValue) {
    let name = guageValue.name;
    if ((guageValue.name).split("_").length > 1) {
        name = (guageValue.name).split("_")[0];
    }
    return {
      name: name,
      counter: parseInt(guageValue.counter),
      description: guageValue.description,
      cpu: guageValue.cpu,
    }

  },

  update() {
    if(this.get('model.content').length>0){
    const content = this.get('model.content').objectAt(0);

    this.set('guageOne', this.shave(content.results.guages.counters[0]));
    this.set('guageTwo', this.shave(content.results.guages.counters[1]));
    this.set('guageThree', this.shave(content.results.guages.counters[2]));
    if (this.contentData().results.guages.counters.length > 3) {
      this.set('guageFour', this.shave(content.results.guages.counters[3]));
    }
  }
}


});
