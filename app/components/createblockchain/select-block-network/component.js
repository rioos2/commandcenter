import Component from '@ember/component';
import C from 'nilavu/utils/constants';
const { get } = Ember;

export default Component.extend({
  intl:          Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),

  showInfo: false,
  activate: false,

  compute:                Ember.computed.alias('model.stacksfactory.resources.compute_type'),
  blockchianNetworkFound: function() {
    return this.get('blockchianNetwork').length > 0;
  }.property('blockchianNetwork'),

  blockchianNetwork: function() {
    var blockchainnetwork = [];

    if (!Ember.isEmpty(this.get('model.blockchainnetworks.content'))) {
      this.get('model.blockchainnetworks.content').map((blockchianNetwork) => {
        if (!Ember.isEmpty(blockchianNetwork.spec.plan)) {
          if (Ember.isEqual(blockchianNetwork.spec.plan.category, C.CATEGORIES.BLOCKCHAIN)) {
            blockchainnetwork.push(blockchianNetwork);
          }
        }
      });
    }

    return blockchainnetwork;
  }.property('model'),

  didInsertElement() {
    this.checkBlockchainNetworkEmpty();
    if (!Ember.isEmpty(this.get('blockchianNetwork'))) {
      this.send('refreshAfterSelect', this.get('blockchianNetwork')[0]);
    }
  },

  actions: {

    refreshAfterSelect(item) {
      this.set('selected', item);
      this.set('model.stacksfactory.metadata.rioos_sh_blockchain_network_id', item.id);
      this.toggleProperty('activate');
    },

    clickInfo() {
      this.set('showInfo', true);
    },

    clickClose() {
      this.set('showInfo', false);
    }
  },
  checkBlockchainNetworkEmpty() {
    if (Ember.isEmpty(this.get('blockchianNetwork'))) {
      this.get('notifications').warning(get(this, 'intl').t('notifications.blockchainNetwork.empty'), {
        autoClear:     true,
        clearDuration: 6000,
        cssClasses:    'notification-warning'
      });
    }
  },

});
