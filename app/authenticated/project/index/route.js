import Ember from 'ember';

export default Ember.Route.extend({

  redirect() {
    //The default is rioorch
    let orch = "rioorch";

    if (orch === 'rioorch') {
      this.replaceWith('infrastructure-tab');
    }
  },
});
