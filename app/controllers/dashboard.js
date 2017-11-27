import Ember from 'ember';

export default Ember.Controller.extend({

  cacheAssemblys: function() {
    return this.get('model');
  }.property('model'),


});
