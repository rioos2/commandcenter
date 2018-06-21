import {
  buildAdminInfraPanel
} from '../admin-infra-panel/component';
import C from 'nilavu/utils/constants';
export default buildAdminInfraPanel('node', {
  network: null,
  selectedNodes: null,
  ninjaNodes: [],
  userStore: Ember.inject.service('user-store'),


  didInsertElement: function() {
    if (!Ember.isEmpty(this.get('nodes'))) {
      this.send('SideData', this.get('nodes').get('firstObject'));
    }
  },

  availableSize: function() {
    return this.get('ninjaNodes').length;
  }.property('ninjaNodes'),

  nodeAvailable: function() {
    return this.get('availableSize') > 0 ;
  }.property('availableSize'),

  availableCalmNodeSize: function() {
    return this.get('calmNodes').length;
  }.property('calmNodes'),

  nodes: function(){
    return Ember.isEmpty(this.get('model.nodes.content'))? [] : this.get('model.nodes.content');
  }.property('model.nodes.content'),

  ninjaNodes: function(){
    return Ember.isEmpty(this.get('model.nodes.content'))? [] : this.get('model.nodes.content').filter((node) => {
      let add = false;
      node.status.conditions.forEach((condition) => {
         if(C.NODE.NINJANODESCONDITIONS.includes(condition.condition_type)){
           add = true;
         };
      });
      return add;
    });
}.property('model.nodes'),

  calmNodes: function(){
    return Ember.isEmpty(this.get('model.nodes.content'))? [] : this.get('model.nodes.content').filter((node) => {
      let add = true;
      node.status.conditions.forEach((condition) => {
         if(C.NODE.NINJANODESCONDITIONS.includes(condition.condition_type)){
           add = false;
         };
      });

      return add;
    });
}.property('model.nodes.content.[]'),


  actions: {
    SideData: function(node) {
      this.set('selectedNode', node);
      this.set('selectedNodeTab', node.id);
    },

    doReload: function() {
      $('#node_add_modal').modal('hide');
      this.sendAction('triggerReload');
    },

    openModal: function() {
      $('#node_add_modal').modal('show');
    },
  }
});
