import {
  buildAdminInfraPanel
} from '../admin-infra-panel/component';
export default buildAdminInfraPanel('storage', {
      // tagName: 'tr' ,
      storageData: null,

      count: function() {
        return this.get('model.storageConnectors.content').length;
      }.property('model'),

      NoStorage: function() {
        return this.get('model.storageConnectors.content').length < 0 ? true : false;
      }.property('model'),

      storages: function() {
        return this.get('model.storageConnectors.content');
      }.property('model'),

      storagesPool: function() {
        alert(JSON.stringify(this.get('model.storagesPool.content')));
        return this.get('model.storagesPool.content');
      }.property('model'),

      getStoargesPool: function(storageConnector) {
        alert("getStoargesPool");
        var pool_list = [];
        alert(JSON.stringify(this.get('model')));
        this.get('model.storagesPool.content').forEach(function(strpool) {
              if (storageConnector.id == strpool.object_meta.owner_references[0].uid) {
                pool_list.push(strpool);
              }
            });
            return pool_list;
          },

          actions: {
            SideData: function(storage) {
              this.set('storageData', storage);
              this.set('storagespool', this.getStoargesPool(storage));
            }
          }


      });
