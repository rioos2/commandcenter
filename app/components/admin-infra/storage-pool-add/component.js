import { get } from '@ember/object';
import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Component.extend(DefaultHeaders, {
  intl:          service(),
  notifications: service('notification-messages'),
  tagName:       '',
  selectedPools: [],
  activate:      false,
  error:         false,

  // All partitions on particullar storage connector
  connectorPartitions: function() {
    if (!isEmpty(this.get('connector.storage_info.disks'))) {
      return this.get('connector.storage_info.disks').map((d) => {
        return {
          disk:  d.disk,
          point: d.point,
          type:  d.disk_type
        };
      });
    }

    return [];
  }.property('connector'),

  // Aleady used partitions by some pool
  usedPartitions: function() {
    if (!isEmpty(this.get('pools'))) {
      return [].concat.apply([], this.get('pools').map((p) => p.storage_info.disks.map((d) => d.disk)));
    }

    return [];
  }.property('pools'),

  type: function() {
    return !isEmpty(this.get('connector.storage_type')) ? this.get('connector.storage_type') : '';
  }.property('connector.storage_type'),

  // Unique non-used partitions by comparing already used partitions on pool
  unUsedPartitions: function() {
    return this.get('connectorPartitions').filter((val) => !this.get('usedPartitions').includes(val.disk)).filter((val) => val.disk !== undefined);
  }.property('connectorPartitions', 'usedPartitions'),

  removeRootPartitions: function() {
    let allGroupedPartition = [];

    this.get('unUsedPartitions').forEach((val) => {
      let groups = {
        disk:  val.disk,
        point: val.point,
        type:  val.type,
        group: []
      };

      this.get('unUsedPartitions').forEach((va) => {
        if (!(val.disk === va.disk)) {
          if (va.disk.includes(val.disk)) {
            groups.group.push(va.disk);
          }
        }
      });
      if (isEmpty(groups.group)) {
        allGroupedPartition.push(groups);
      }
    });

    return allGroupedPartition;
  }.property('unUsedPartitions'),

  didInsertElement() {
    this.set('error', this.displayMessage());
  },

  actions: {

    createPool() {
      this.set('showSpinner', true);
      if (!this.validation()) {
        this.get('userStore').rawRequest(this.rawRequestOpts({
          url:    '/api/v1/storagespool',
          method: 'POST',
          data:   {
            connector_id: this.get('connector.id'),
            storage_info: { disks: this.get('selectedPools'), },
            object_meta:  { name: this.get('name'), },
            status:       { phase: 'Pending' }
          },
        })).then(() => {
          this.set('modelSpinner', true);
          this.set('showSpinner', false);
          this.sendAction('doReload');
          this.refresh();
        }).catch(() => {
          this.set('showSpinner', false);
          this.set('modelSpinner', false);
        });
      } else {
        this.set('showSpinner', false);
        this.get('notifications').warning(htmlSafe(this.get('validationWarning')), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      }
    },

    updatePoolData(select, data) {
      this.attachAndDetachLocation(data, select);
    },
  },

  attachAndDetachLocation(diskName, active) {
    let data;

    this.get('connector.storage_info.disks').forEach((d) => {
      if (d.disk === diskName) {
        data = d;
      }
    });
    if (data) {
      this.handlePartition(data, active);
    }
  },

  handlePartition(data, active) {
    let list = this.get('selectedPools').map((x) => {
      return x.disk;
    }).indexOf(data.disk);

    if (!active) {
      (list === 0) ? this.get('selectedPools').shift() : this.get('selectedPools').splice(list, 1);
    } else {
      this.get('selectedPools').push(data);
    }
  },

  validation() {
    var validationString = '';

    if (isEmpty(this.get('name'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.storage.pool.nameError'));
    }
    if (isEmpty(this.get('selectedPools'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.storage.pool.diskError'));
    }
    this.set('validationWarning', validationString);

    return isEmpty(this.get('validationWarning')) ? false : true;
  },
  displayMessage() {
    if (isEmpty(this.get('storages'))) {
      this.set('pageWarning', get(this, 'intl').t('stackPage.admin.storage.pool.storagesDisplayError'));

      return true;
    } else {
      return false;
    }
  },

  refresh() {
    this.setProperties({
      name:          '',
      selectedPools: '',
    });
  },

});
