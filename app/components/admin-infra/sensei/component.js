import { buildAdminInfraPanel } from '../admin-infra-panel/component';
import C from 'nilavu/utils/constants';
export default buildAdminInfraPanel('sensei', {
  network:       null,
  selectedNodes: null,
  senseiNodes:   [],
  userStore:     Ember.inject.service('user-store'),
  nodeType:      'sensei',


  didInsertElement() {
    if (!Ember.isEmpty(this.get('senseis'))) {
      this.send('SideData', this.get('senseis').get('firstObject'));
    }
  },

  availableSize: function() {
    return this.get('senseiNodes').length;
  }.property('senseiNodes'),

  senseis: function() {
    return Ember.isEmpty(this.get('model.senseis.content')) ? [] : this.get('model.senseis.content');
  }.property('model.senseis.content'),

  senseiNodes: function() {
    return Ember.isEmpty(this.get('model.senseis.content')) ? [] : this.get('model.senseis.content').filter((sensei) => {
      let add = false;

      if (!Ember.isEmpty(sensei.status.phase)) {
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
