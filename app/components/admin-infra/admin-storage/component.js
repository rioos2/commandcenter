import {
  buildAdminInfraPanel
} from '../admin-infra-panel/component';
export default buildAdminInfraPanel('storage', {
      storageData: null,
      storagespool: null,

      didInsertElement: function() {
        if(!Ember.isEmpty(this.get('storages'))) {
          this.send('SideData',this.get('storages').get('firstObject'));
        }
      },

      count: function() {
        return this.get('model.storageConnectors.content').length;
      }.property('model'),

      storageFound: function() {
        return this.get('model.storageConnectors.content').length > 0 ? true : false;
      }.property('model'),

      storages: function() {
        return this.get('model.storageConnectors.content');
      }.property('model'),

      getStoargesPool: function(storageConnector) {
        var pool_list = [];
        this.get('model.storagesPool.content').forEach(function(strpool) {
              if (storageConnector.id == strpool.connector_id) {
                pool_list.push(strpool);
              }
            });
            return pool_list;
          },

          actions: {
            SideData: function(storage) {
              this.set('storageData', storage);
              this.set('storagespool',this.getStoargesPool(storage) );
            }
          }


      });
