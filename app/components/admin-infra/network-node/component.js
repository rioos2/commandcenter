import Ember from 'ember';
export default Ember.Component.extend({

  name: function(){
    return this.get('node.object_meta.name');
  }.property('node.object_meta.name'),

  ip: function() {
    return this.get('node.node_ip');
  }.property('node.node_ip'),

});
