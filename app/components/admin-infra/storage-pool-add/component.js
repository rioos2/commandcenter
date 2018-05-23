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
  error: false,

  didInsertElement: function() {
    this.set('error', this.displayMessage());
  },

  //All partitions on particullar storage connector
  connectorPartitions: function() {
    if (!Ember.isEmpty(this.get('connector.storage_info.disks'))) {
      return this.get('connector.storage_info.disks').map(function(d) {
          return {disk:d.disk, point:d.point, type:d.disk_type};
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

  type: function(){
      return !Ember.isEmpty(this.get('connector.storage_type')) ? this.get('connector.storage_type') : "" ;
  }.property('connector.storage_type'),

  //Unique non-used partitions by comparing already used partitions on pool
  unUsedPartitions: function() {
    return this.get('connectorPartitions').filter(val => !this.get('usedPartitions').includes(val.disk)).filter(val => val.disk !== undefined);
  }.property('connectorPartitions', 'usedPartitions'),

  removeRootPartitions: function() {
    let allGroupedPartition = [];
    this.get('unUsedPartitions').forEach(function (val){
            let groups ={disk: val.disk, point:val.point, type:val.type, group:[]};
        this.get('unUsedPartitions').forEach(function (va){
                  if(!(val.disk == va.disk)) {
                    if(va.disk.includes(val.disk)) {
                      groups.group.push(va.disk);
                    }
                  }
            }.bind(this));
            if(Ember.isEmpty(groups.group)) {
              allGroupedPartition.push(groups);
            }
    }.bind(this));
    return allGroupedPartition;
  }.property('unUsedPartitions'),

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
  displayMessage() {
    if (Ember.isEmpty(this.get('storages'))) {
      this.set('pageWarning', get(this, 'intl').t('stackPage.admin.storage.pool.storagesDisplayError'));
      return true;
    } else {
      return false;
    }
  },

  refresh() {
  this.setProperties({
   name: '',
   selectedPools: '',
  });
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
            phase: "Pending"
          }
        },
      })).then((xhr) => {
        this.set('showSpinner', false);
        location.reload();
        this.refresh();
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
