import Ember from 'ember';
import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Component.extend(DefaultHeaders, {
      tagName: '',
      selectedPools: [],

      //All partitions on particullar storage connector
      connectorPartitions: function() {
        if (!Ember.isEmpty(this.get('connector.storage_info.disks'))) {
          return this.get('connector.storage_info.disks').map(function(d) {
            if (!C.STORAGE.LOCATION.NOTALLOW.includes(d.point)) {
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

      attachAndDetachLocation: function(diskName) {
        let find = false;
        this.get('connector.storage_info.disks').forEach(function(d) {
          if (d.disk == diskName) {
            find = true;
            this.get('selectedPools').push(d);
          }
        }.bind(this));
      },

      actions: {

        createPool: function() {
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
                  location.reload();
              }).catch((err) => {

              });
            },

            updatePoolData: function(select, data) {
              if (select) {
                this.attachAndDetachLocation(data);
              }
            },
        },

      });
