import Ember from 'ember';
export default Ember.Component.extend({

  nodeName: function(){
    return this.get('model.object_meta.name');
  }.property('model.object_meta.name'),

  ip: function() {
    return this.get('model.node_ip');
  }.property('model.node_ip'),

  schedule: function() {
    return this.get('model.spec.unschedulable')? "No" : "Yes";
  }.property('model.spec.unschedulable'),

  active: function() {
    return Ember.isEqual(this.get('selectedNodeTab'),this.get('model.id'))? "active" :"";
  }.property('selectedNodeTab'),
});
