import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';


import { buildInfraPanel } from '../basic-panel/component';
export default buildInfraPanel('senseis', {
  network:       null,
  selectedNodes: null,
  userStore:     service('user-store'),
  nodeType:      'sensei',


  didInsertElement() {
    if (!isEmpty(this.get('senseis'))) {
      this.send('SideData', this.get('senseis').get('firstObject'));
    }
  },

  availableSize: function() {
    return this.get('senseiNodes').length;
  }.property('senseiNodes'),

  senseis: function() {
    return isEmpty(this.get('model.senseis.content')) ? [] : this.get('model.senseis.content');
  }.property('model.senseis.content'),

  senseiNodes: function() {
    return isEmpty(this.get('model.senseis.content')) ? [] : this.get('model.senseis.content').filter((sensei) => {
      let add = false;

      if (!isEmpty(sensei.status.phase)) {
        add = true;
      }

      return add;
    });
  }.property('model.senseis.content.[]'),


  actions: {
    SideData(sensei) {
      this.set('selectedNode', sensei);
      this.set('selectedNodeTab', sensei.id);
    },
  }
});
