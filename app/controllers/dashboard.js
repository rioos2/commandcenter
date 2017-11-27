import Ember from 'ember';

export default Ember.Controller.extend({

  bootstrap: function() {
    console.log(JSON.stringify(this.get('model')));
  }.observes('model'),


});
