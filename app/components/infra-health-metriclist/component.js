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
    return Ember.isEmpty(Object.keys(this.contentData())) ? this.emptyData("ram") : this.decide(this.contentData().results.guages.counters[0],"ram");
  }.property('model.content'),

  guageTwo: function() {
    //cpu
    return Ember.isEmpty(Object.keys(this.contentData()))? this.emptyData("cpu") : this.decide(this.contentData().results.guages.counters[1],"cpu");
  }.property('model.content'),

  guageThree: function() {
    //disk
    return Ember.isEmpty(Object.keys(this.contentData()))? this.emptyData("disk") : this.decide(this.contentData().results.guages.counters[2],"disk");
  }.property('model.content'),

  guageFour: function() {
    //gpu
    if(!Ember.isEmpty(Object.keys(this.contentData()))){
    if (this.contentData().results.guages.counters.length > 3) {
      return this.shave(this.contentData().results.guages.counters[3]);
    }
  }
    return this.emptyData("gpu");
  }.property('model.content'),

  emptyData: function(data) {
    return {
      name: data,
      counter: "0",
    }
  },

  contentData: function() {
    if(this.get('model.content')){
    return this.get('model.content').objectAt(0);
    }
    return {};
  },

  decide: function(guageValue,name){
    return !Ember.isEmpty(guageValue.name) ? this.shave(guageValue): this.emptyData(name);
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
