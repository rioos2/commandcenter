import Ember from 'ember';

export default Ember.Controller.extend({
  notifications: Ember.inject.service('notification-messages'),
  session: Ember.inject.service(),

  init: function() {
    this._super();
    var session = this.get('session');
    Ember.run.schedule("afterRender", this, function() {
      if (localStorage["lastVisitedRoute"] == "login") {
        this.get('notifications').info('Welcome ' + session.get("email"), {
          autoClear: true,
          clearDuration: 5200
        });
        localStorage["lastVisitedRoute"] = "";
      }
    });
  },

  cacheAssemblys: function() {
    return this.get('model');
  }.property('model'),


});
