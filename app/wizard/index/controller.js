import C from 'nilavu/utils/constants';
import Controller from '@ember/controller';

export default Controller.extend({

  categories: [C.WIZARD.STEPS.WELCOME, C.WIZARD.STEPS.REGISTERADMIN, C.WIZARD.STEPS.ACTIVATE],

  completedSteps: [],

  panels: [],

  //  This has be evaluated based on data. So we show the tab that has max
  //  number of launches.
  selectedTab: C.WIZARD.STEPS.WELCOME,

  actions: {
    nextStep(step) {
      this.get('completedSteps').pushObject(step);
      this.set('selectedTab', this.get('categories')[this.get('categories').indexOf(step) + 1]);
    },
  }
});
