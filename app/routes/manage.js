import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Route.extend(DefaultHeaders, {

  activate: function() {
    this.send('unfixedTop');
    this.send('unfixedBottom');
  },
  deactivate: function() {
    this.send('unfixedTop');
    this.send('unfixedBottom');
  },

  beforeModel: function() {
    var previousRoutes = this.router.router.currentHandlerInfos;
    var previousRoute = previousRoutes && previousRoutes.pop();
    if (previousRoute) {
      localStorage["lastVisitedRoute"] = previousRoute.name;
    }
  },

  model: function() {
    var self = this;
    return this.get('store').findAll('assembly', this.opts('assemblys')).then((assemblys) => {
      return assemblys;
    }).catch(function() {
      self.set('loading', false);
    });

  },

});
