import Route from '@ember/routing/route';

export default Route.extend({

  // This going to be replaced by dashboard
  beforeModel() {
    this.transitionTo('admin.dojos');
  }

});
