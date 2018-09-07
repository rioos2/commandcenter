import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { isEqual } from '@ember/utils';
import C from 'nilavu/utils/constants';

export default Component.extend({
  intl:          service(),
  notifications: service('notification-messages'),

  showInfo: false,
  activate: false,

  compute:                alias('model.stacksfactory.resources.compute_type'),
  blockchianNetworkFound: function() {
    return this.get('blockchianNetwork').length > 0;
  }.property('blockchianNetwork'),

  blockchianNetwork: function() {
    var blockchainnetwork = [];

    if (!isEmpty(this.get('model.blockchainnetworks.content'))) {
      this.get('model.blockchainnetworks.content').map((blockchianNetwork) => {
        if (!isEmpty(blockchianNetwork.spec.plan)) {
          if (isEqual(blockchianNetwork.spec.plan.category, C.CATEGORIES.BLOCKCHAIN)) {
            blockchainnetwork.push(blockchianNetwork);
          }
        }
      });
    }

    return blockchainnetwork;
  }.property('model'),

  didInsertElement() {
    this.checkBlockchainNetworkEmpty();
    if (!isEmpty(this.get('blockchianNetwork'))) {
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
    if (isEmpty(this.get('blockchianNetwork'))) {
      this.get('notifications').warning(get(this, 'intl').t('notifications.blockchainNetwork.empty'), {
        autoClear:     true,
        clearDuration: 6000,
        cssClasses:    'notification-warning'
      });
    }
  },

});
