import Ember from 'ember';
export default Ember.Component.extend({

  name: function(){
    return this.get('network.object_meta.name');
  }.property('network.object_meta.name'),

  type: function() {
    return this.get('network.network_type');
  }.property('network.network_type'),

});
