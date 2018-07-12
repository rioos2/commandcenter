import Ember from 'ember';

export default Ember.Controller.extend({

  access: Ember.inject.service(),
  stepone: true,

  step: function() {
    switch (this.get('selectedStep')) {
      case '1':
        this.send('stepOne');
        break;
      case '2':
        this.send('stepTwo');
        break;
      case '3':
        this.send('stepThree');
        break;
    }
  }.observes('selectedStep'),


  actions: {
    stepOne() {
      this.set('stepthree', false);
      this.set('steptwo', false);
      this.set('stepone', true);
      this.transitionToRoute('wizard.steps.step', '1');
    },

    stepTwo() {
      this.set('stepone', false);
      this.set('stepthree', false);
      this.set('steptwo', true);
      this.transitionToRoute('wizard.steps.step', '2');
    },

    stepThree() {
      this.set('stepone', false);
      this.set('steptwo', false);
      this.set('stepthree', true);
      this.transitionToRoute('wizard.steps.step', '3');
    },

    processTrail() {
      this.get('access').activationComplete().then((xhr) => {
        location.reload();
      });
    },

  }
});
