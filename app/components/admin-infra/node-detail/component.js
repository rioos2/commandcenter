import Ember from 'ember';
import C from 'nilavu/utils/constants';
export default Ember.Component.extend({

  showSchedule: true,

  nodeName: function(){
    return this.get('model.object_meta.name');
  }.property('model.object_meta.name'),

  ip: function() {
    return this.get('model.node_ip');
  }.property('model.node_ip'),

  schedule: function() {
    return this.get('model.spec.unschedulable')? "No" : "Yes";
  }.property('model.spec.unschedulable'),

  nodeLabels: function() {
    let labels = Ember.isEmpty(this.get('model.object_meta.labels.available_resource')) ? [] : this.get('model.object_meta.labels.available_resource').split(',');
    const statusPhase = this.get('model.status.phase');
    if(C.NODE.INSTALLFAILURE.includes(statusPhase)) {
      labels.push(statusPhase);
    }
    return labels;
  }.property('model.object_meta.labels.available_resource'),


  active: function() {
    return Ember.isEqual(this.get('selectedNodeTab'),this.get('model.id'))? "active" :"";
  }.property('selectedNodeTab'),

  actions: {

    doReload: function() {
      this.sendAction('reload');
    }

  }
});
