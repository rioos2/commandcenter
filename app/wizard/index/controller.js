import Ember from 'ember';
import C from 'nilavu/utils/constants';

export default Ember.Controller.extend({

  categories: [C.WIZARD.STEPS.START, C.WIZARD.STEPS.REGISTER, C.WIZARD.STEPS.ACTIVATE],

  completedSteps: [],

  panels: [],

  //This has be evaluated based on data. So we show the tab that has max
  //number of launches.
  selectedTab: C.WIZARD.STEPS.START,

  actions: {
    nextStep(step) {
      this.get('completedSteps').pushObject(step);
      this.set('selectedTab', this.get('categories')[this.get('categories').indexOf(step) + 1]);
    },
  }
});
