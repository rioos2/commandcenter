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

      availableSize: function() {
        return this.get('storages').length;
      }.property('model'),

      storageAvailable: function() {
        return this.get('availableSize') > 0 ;
      }.property('model'),

      storages: function() {
        return Ember.isEmpty(this.get('model.storageConnectors.content'))? [] : this.get('model.storageConnectors.content');
      }.property('model.storageConnectors.content.@each'),

      poolsUpdater: function() {
        this.set('storagespool',this.getStoragesPool(this.get("storageData")));
      }.observes('model.storageConnectors.content.@each'),

      getStoragesPool: function(storageConnector) {
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
              this.set('selectedStorage', storage.id);
              this.set('storagespool',this.getStoragesPool(storage) );
            },

            doReload: function() {
              $('#pooladd').modal('hide');
              this.sendAction('reload');
            }
          }
      });
