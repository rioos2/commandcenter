/* global renderBlueGaugeChart, d3, particlesJS */
import Component from '@ember/component';
import Ember from 'ember';

export default Component.extend({

  tagName: '',

  guageOne: function() {
    this.update();
  }.observes('model'),


  cpu: function(){
      const content = this.get('model.content').objectAt(0);
      return content.results.guages.counters[0];
  }.property('model.content'),
  ram: function(){
      const content = this.get('model.content').objectAt(0);
      return content.results.guages.counters[1];
  }.property('model.content'),
  disk: function(){
      const content = this.get('model.content').objectAt(0);
      return content.results.guages.counters[2];
  }.property('model.content'),
  unknown: function(){
      const content = this.get('model.content').objectAt(0);
      return content.results.guages.counters[3];
  }.property('model.content'),

  update(){
    const content = this.get('model.content').objectAt(0);
    // alert(JSON.stringify(content.results.guages.counters[0]));

    this.set('cpu', content.results.guages.counters[0]);
 this.set('ram', content.results.guages.counters[1]);
  }


});
