import Ember from 'ember';

export default Ember.Route.extend({

  // It the user logined in redirect dashboard (infrastructure-tab)
  redirect() {
    this.replaceWith('infrastructure-tab');
  },
});
