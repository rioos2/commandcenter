import Component from '@ember/component';
import C from 'nilavu/utils/constants';
const { get } = Ember;

export default Component.extend({
  intl: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),

    compute: Ember.computed.alias('model.assemblyfactory.resources.compute_type'),
    showInfo: false,
    activate: false,

    didInsertElement() {
      this.checkBlockchainNetworkEmpty();
      if(!Ember.isEmpty(this.get('blockchianNetwork'))) {
          this.send('refreshAfterSelect',this.get('blockchianNetwork')[0]);
      }
    },

    blockchianNetworkFound: function(){
      return this.get('blockchianNetwork').length > 0;
    }.property('blockchianNetwork'),

    checkBlockchainNetworkEmpty: function(){
      if(Ember.isEmpty(this.get('blockchianNetwork'))){
        this.get('notifications').warning(get(this, 'intl').t('notifications.blockchainNetwork.empty'), {
          autoClear: true,
          clearDuration: 6000,
          cssClasses:'notification-warning'
        });
      }
    },

    blockchianNetwork: function(){
      return Ember.isEmpty(this.get('model.blockchainfactorys.content'))? [] : this.get('model.blockchainfactorys.content');
    }.property('model'),

    actions: {

      refreshAfterSelect(item) {
        this.set("selected", item);
        this.set("model.assemblyfactory.metadata.rioos_sh_blockchain_network_id", item.id);
        this.toggleProperty('activate');
      },

        clickInfo: function() {
            this.set('showInfo', true);
        },

        clickClose: function() {
            this.set('showInfo', false);
        }
    }
});