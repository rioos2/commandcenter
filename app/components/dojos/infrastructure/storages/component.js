import { isEmpty } from '@ember/utils';
import { buildInfraPanel } from '../basic-panel/component';
import $ from 'jquery';

export default buildInfraPanel('storages', {
  storageData:  null,
  storagespool: null,

  didInsertElement() {
    if (!isEmpty(this.get('storages'))) {
      this.send('SideData', this.get('storages').get('firstObject'));
    }
  },

  availableSize: function() {
    return this.get('storages').length;
  }.property('model'),

  storageAvailable: function() {
    return this.get('availableSize') > 0 ;
  }.property('model'),

  storages: function() {
    return isEmpty(this.get('model.storageConnectors.content')) ? [] : this.get('model.storageConnectors.content');
  }.property('model.storageConnectors.content.@each'),

  poolsUpdater: function() {
    this.set('storagespool', this.getStoragesPool(this.get('storageData')));
  }.observes('model.storageConnectors.content.@each'),

  getStoragesPool(storageConnector) {
    var pool_list = [];

    this.get('model.storagesPool.content').forEach((strpool) => {
      if (storageConnector.id === strpool.connector_id) {
        pool_list.push(strpool);
      }
    });

    return pool_list;
  },

  actions: {
    SideData(storage) {
      this.set('storageData', storage);
      this.set('selectedStorage', storage.id);
      this.set('storagespool', this.getStoragesPool(storage) );
    },

    doReload() {
      $('#pooladd').modal('hide');
      $('#storage_edit').modal('hide');
      this.sendAction('triggerReload');
    },

    doStorageReload() {
      $('#storage_edit').modal('hide');
      this.sendAction('triggerReload');
    },

  }
});
