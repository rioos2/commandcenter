import Ember from 'ember';

export default Ember.Component.extend({

  seletedOs: function() {
    if(this.get('selected')) {
      return this.get('selected');
    } else {
      return "none";
    }
  }.property('selected'),

});
