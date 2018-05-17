import Ember from 'ember';
import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
const {
  get
} = Ember;

export default Ember.Component.extend(DefaultHeaders, {

  intl: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  tagName: '',
  selectedNodes: [],
  selectedNetworks: [],
  selectedStorage: '',
  error: false,

  didInsertElement: function() {
    this.set('error', this.displayMessage());
  },

  storages: function() {
      return this.nameGetter(this.get('model.storageConnectors.content'));
  }.property('model.storageConnectors.content'),

  nodes: function() {
    return this.nameGetter(this.get('model.nodes.content'));
      // return [];
  }.property('model.nodes.content'),

  networks: function() {
      return this.nameGetter(this.get('model.networks.content'));
  }.property('model.networks.content'),

  storageId: function(name) {
    let id;
     this.get('model.storageConnectors.content').forEach(function(s) {
          if(name == s.object_meta.name) {
            id = s.id;
          }
      });
      return id;
  },

  nameGetter: function(data) {
    if (!Ember.isEmpty(data)) {
      return data.map(function(d) {
          return {name:d.object_meta.name, id:d.id};
      });
    }
    return [];
  },

  displayMessage() {
    if (Ember.isEmpty(this.get('storages'))) {
      this.set('pageWarning', get(this, 'intl').t('stackPage.admin.cluster.add.storagesDisplayError'));
      return true;
    } else if (Ember.isEmpty(this.get('nodes'))) {
      this.set('pageWarning', get(this, 'intl').t('stackPage.admin.cluster.add.nodesDisplayError'));
      return true;
    } else if (Ember.isEmpty(this.get('networks'))) {
      this.set('pageWarning', get(this, 'intl').t('stackPage.admin.cluster.add.networksDisplayError'));
      return true;
    } else {
      return false;
    }
  },


  validation() {
    if (Ember.isEmpty(this.get('name'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.cluster.add.nameError'));
      return true;
    } else if (Ember.isEmpty(this.get('selectedStorage'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.cluster.add.storageError'));
      return true;
    } else if (Ember.isEmpty(this.get('currency'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.cluster.add.currencyError'));
      return true;
    } else if (Ember.isEmpty(this.get('selectedNodes'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.cluster.add.nodesError'));
      return true;
    } else if (Ember.isEmpty(this.get('selectedNetworks'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.cluster.add.networksError'));
      return true;
    } else {
      return false;
    }
  },

  getData: function() {
    return {
      nodes: this.get('selectedNodes'),
      networks: this.get('selectedNetworks'),
      storage: this.storageId(this.get('selectedStorage')),
      currency: this.get('currency'),
      flag: this.get('name') +".png",
      // enabled: true,
      advanced_settings:{},
      object_meta: {
        name: this.get('name'),
      },
      status: {
        phase: "ready"
      }
    };
  },

  actions: {

    createLocation: function() {
      this.set('showSpinner', true);
      if (!this.validation()) {
      this.get('userStore').rawRequest(this.rawRequestOpts({
        url: '/api/v1/datacenters',
        method: 'POST',
        data: this.getData(),
      })).then((xhr) => {
        this.set('showSpinner', false);
        location.reload();
      }).catch((err) => {
        alert(JSON.stringify(Object.keys(err)));
        this.set('showSpinner', false);
      });
    } else {
      this.set('showSpinner', false);
      this.get('notifications').warning(this.get('validationWarning'), {
        autoClear: true,
        clearDuration: 4200,
        cssClasses: 'notification-warning'
      });
    }
    },

    selectStorage: function(storage) {
      this.set('selectedStorage', storage);
    },

    updateNodeData: function(select, data) {
      select ? this.get('selectedNodes').push(data) : this.get('selectedNodes').removeObject(data);
    },

    updateNetworkData: function(select, data) {
      select ? this.get('selectedNetworks').push(data) : this.get('selectedNetworks').removeObject(data);
    },

  },

});
