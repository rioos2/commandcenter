import Ember from 'ember';

export default Ember.Controller.extend({

  access: Ember.inject.service(),
  stepone: true,

  step: function() {
    switch (this.get('selectedStep')) {
      case 'step1':
        this.send('stepOne');
        break;
      case 'step2':
        this.send('stepTwo');
        break;
      case 'step3':
        this.send('stepThree');
        break;
    }
  }.observes('selectedStep'),


  actions: {
    stepOne() {
      this.set('stepthree', false);
      this.set('steptwo', false);
      this.set('stepone', true);
      this.transitionToRoute('wizard.steps.step', 'step1');
    },

    stepTwo() {
      console.log(this.get('app'));
      this.set('stepone', false);
      this.set('stepthree', false);
      this.set('steptwo', true);
      this.transitionToRoute('wizard.steps.step', 'step2');
    },

    stepThree() {
      this.set('stepone', false);
      this.set('steptwo', false);
      this.set('stepthree', true);
      this.transitionToRoute('wizard.steps.step', 'step3');
    },

    processTrail() {
      this.get('access').createConfigFile().then((xhr) => {
        location.reload();
      });
    },

  }
});
