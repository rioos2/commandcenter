import { inject as service } from '@ember/service';
import $ from 'jquery';
import { isEmpty } from '@ember/utils';
import { buildAdminInfraPanel } from '../admin-infra-panel/component';

export default buildAdminInfraPanel('node', {
  network:       null,
  selectedNodes: null,
  userStore:     service('user-store'),
  nodeType:      'node',


  didInsertElement() {
    if (!isEmpty(this.get('nodes'))) {
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
    return isEmpty(this.get('model.nodes.content')) ? [] : this.get('model.nodes.content');
  }.property('model.nodes.content'),

  ninjaNodes: function() {
    return isEmpty(this.get('model.nodes.content')) ? [] : this.get('model.nodes.content').filter((node) => {
      let add = false;

      if (!isEmpty(node.status.phase)) {
        add = true;
      }

      return add;
    });
  }.property('model.nodes.content.[]'),

  calmNodes: function() {
    return isEmpty(this.get('model.nodes.content')) ? [] : this.get('model.nodes.content').filter((node) => {
      let add = true;

      if (this.get('ninjaNodes').map((n) => n.node_ip).includes(node.node_ip) || !isEmpty(node.status.phase)) {
        add = false;
      }

      return add;
    });
  }.property('model.nodes.content.[]', 'ninjaNodes'),


  actions: {
    SideData(node) {
      this.set('selectedNode', node);
      this.set('selectedNodeTab', node.id);
    },

    reload() {
      this.sendAction('triggerReload');
    },

    openModal() {
      $('#node_add_modal').modal('show');
    },
  }
});
