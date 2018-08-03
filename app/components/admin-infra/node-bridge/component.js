import Ember from 'ember';
export default Ember.Component.extend({

  name: function(){
    return this.get('bridge.bridge_name');
  }.property('bridge.bridge_name'),

  type: function() {
    return Ember.isEmpty(this.get('bridge.bridge_type')) ? '' : this.get('bridge.bridge_type').capitalize();
  }.property('bridge.bridge_type'),

});
