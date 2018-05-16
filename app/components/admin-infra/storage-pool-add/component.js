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
  selectedPools: [],
  activate: false,

  //All partitions on particullar storage connector
  connectorPartitions: function() {
    if (!Ember.isEmpty(this.get('connector.storage_info.disks'))) {
      return this.get('connector.storage_info.disks').map(function(d) {
        if (!C.STORAGE.LOCATION.NOTALLOW.includes(d.point) && d.point == "") {
          return d.disk;
        }
      });
    }
    return [];
  }.property('connector'),

  //Aleady used partitions by some pool
  usedPartitions: function() {
    if (!Ember.isEmpty(this.get('pools'))) {
      return [].concat.apply([], this.get('pools').map((p) => p.storage_info.disks.map((d) => d.disk)));
    }
    return [];
  }.property('pools'),

  //Unique non-used partitions by comparing already used partitions on pool
  unUsedPartitions: function() {
    return this.get('connectorPartitions').filter(val => !this.get('usedPartitions').includes(val)).filter(val => val !== undefined);
  }.property('connectorPartitions', 'usedPartitions'),

  attachAndDetachLocation: function(diskName, active) {
    let data;
    this.get('connector.storage_info.disks').forEach(function(d) {
      if (d.disk == diskName) {
        data = d;
      }
    }.bind(this));
    if (data) {
      this.handlePartition(data, active);
    }
  },

  handlePartition: function(data, active) {
    let find = false;
    let list = this.get('selectedPools').map(function(x) {
      return x.disk;
    }).indexOf(data.disk);

    if (!active) {
      (list == 0) ? this.get('selectedPools').shift(): this.get('selectedPools').splice(list, 1);
    } else {
      this.get('selectedPools').push(data);
    }
  },

  validation() {
    if (Ember.isEmpty(this.get('name'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.storage.pool.nameError'));
      return true;
    } else if (Ember.isEmpty(this.get('selectedPools'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.storage.pool.diskError'));
      return true;
    } else {
      return false;
    }
  },

  actions: {

    createPool: function() {
      this.set('showSpinner', true);
      if (!this.validation()) {
      this.get('userStore').rawRequest(this.rawRequestOpts({
        url: '/api/v1/storagespool',
        method: 'POST',
        data: {
          connector_id: this.get('connector.id'),
          storage_info: {
            disks: this.get('selectedPools'),
          },
          object_meta: {
            name: this.get('name'),
          },
          status: {
            phase: "pending"
          }
        },
      })).then((xhr) => {
        this.set('showSpinner', false);
        location.reload();
      }).catch((err) => {
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

    updatePoolData: function(select, data) {
      this.attachAndDetachLocation(data, select);
    },
  },

});
