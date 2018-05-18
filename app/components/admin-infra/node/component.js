import {
  buildAdminInfraPanel
} from '../admin-infra-panel/component';
export default buildAdminInfraPanel('node', {
  network: null,
  selectedNodes: null,

  didInsertElement: function() {
    if (!Ember.isEmpty(this.get('nodes'))) {
      this.send('SideData', this.get('nodes').get('firstObject'));
    }
  },

  availableSize: function() {
    return this.get('nodes').length;
  }.property('nodes'),

  nodeAvailable: function() {
    return this.get('availableSize') > 0 ;
  }.property('availableSize'),

  nodes: function(){
    return this.get('model.nodes.content');
  }.property('model.nodes.content'),


  actions: {
    SideData: function(node) {
      this.set('selectedNode', node);
      this.set('selectedNodeTab', node.id);
    }
  }
});
