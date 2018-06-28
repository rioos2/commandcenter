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
    return this.get('availableSize') > 0;
  }.property('availableSize'),

  availableCalmNodeSize: function() {
    return this.get('calmNodes').length;
  }.property('calmNodes'),

  nodes: function() {
    return Ember.isEmpty(this.get('model.nodes.content')) ? [] : this.get('model.nodes.content');
  }.property('model.nodes.content'),

  ninjaNodes: function() {
    return Ember.isEmpty(this.get('model.nodes.content')) ? [] : this.get('model.nodes.content').filter((node) => {
      let add = false;
      if(!Ember.isEmpty(node.status.phase)) {
        add = true;
      }
      return add;
    });
  }.property('model.nodes.content.[]'),

  calmNodes: function() {
    return Ember.isEmpty(this.get('model.nodes.content')) ? [] : this.get('model.nodes.content').filter((node) => {
      let add = true;
      if (this.get('ninjaNodes').map((n) => n.node_ip).includes(node.node_ip) || !Ember.isEmpty(node.status.phase)) {
        add = false;
      };
      return add;
    });
  }.property('model.nodes.content.[]', 'ninjaNodes'),


  actions: {
    SideData: function(node) {
      this.set('selectedNode', node);
      this.set('selectedNodeTab', node.id);
    },

    nodeReload: function() {
      this.sendAction('triggerReload');
    },

    openModal: function() {
      $('#node_add_modal').modal('show');
    },
  }
});
