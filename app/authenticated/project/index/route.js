import Route from '@ember/routing/route';

export default Route.extend({

  // It the user logined in redirect dashboard (infrastructure-tab)
  redirect() {
    this.replaceWith('infrastructure-tab');
  },
});
