import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';
import { xhrConcur } from 'nilavu/utils/platform';
import C from 'nilavu/utils/constants';
import D from 'nilavu/utils/default';
import { denormalizeName } from 'nilavu/utils/denormalize';
import { isEmpty } from '@ember/utils';
import { Promise } from 'rsvp';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import EmberObject from '@ember/object';

export default Route.extend(DefaultHeaders,  {
  settings: service(),
  access:   service(),
  router:   service(),
  model() {
    let setting = this.get('settings');
    let promise = new Promise((resolve, reject) => {
      let tasks = {
        datacenters: this.cbFind('datacenter', 'datacenters'),
        plans:       this.cbFind('planfactory', 'plans'),
        networks:    this.cbFind('network', 'networks'),
      };

      async.auto(tasks, xhrConcur, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    }, 'Load all the things');

    return promise.then((hash) => {
      return EmberObject.create({
        stacksfactory: this.loadStacksFactory(this.getSettings(setting)),
        hscaling:      this.loadHorizontalScaling(this.getSettings(setting)),
        vscaling:      this.loadVerticalScaling(this.getSettings(setting)),
        secret:        this.loadSecret(setting),
        datacenters:   hash.datacenters,
        plans:         hash.plans,
        settings:      this.getSettings(setting),
        networks:      hash.networks,
      });
    });
  },

  cbFind(type, url) {
    return (results, cb) => {
      if (typeof results === 'function') {
        cb = results;
        results = null;
      }

      return this.get('store').findAll(type, this.opts(url)).then((res) => {
        cb(null, res);
      }).catch((err) => {
        cb(err, null);
      });
    };
  },

  getSettings(data){
    return isEmpty(data.all.content) ? {} : data.all.content.objectAt(0).data;
  },

  getSecretType(setting) {
    return this.getSettings(setting)[denormalizeName(`${ C.SETTING.DEFAULT_SECRET_TYPE }`)] || D.VPS.defaultSecret;
  },

  loadSecret(setting) {
    var secretData = {
      type:        'secret',
      secret_type: this.getSecretType(setting),
      data:        {},
      object_meta: ObjectMetaBuilder.buildObjectMeta(),
      metadata:    {},
    };

    return this.get('store').createRecord(secretData);
  },

  loadHorizontalScaling(settings) {
    var horizontalScalingData;

    settings.cloudType = C.CATEGORIES.CONTAINER;

    horizontalScalingData = {
      object_meta: ObjectMetaBuilder.buildObjectMeta(settings),
      type:        'horizontalscaling',
      scale_type:  'AUTOHS',
      state:       'ABLETOSCALE',
      spec:        {
        min_replicas:         1,
        max_replicas:         2,
        scale_up_wait_time:   5,
        scale_down_wait_time: 5,
        metrics:              []
      },
      status: {
        last_scale_time:  '',
        current_replicas: 1,
        desired_replicas: 0
      },
      target_value: {
        min_target_value_cpu:    20,
        max_target_value_cpu:    80,
        min_target_value_memory: 20,
        max_target_value_memory: 80,
        min_target_value_disk:   20,
        max_target_value_disk:   80
      },
      horizontal_scaling_rule_apply: false,
    };

    return this.get('store').createRecord(horizontalScalingData);
  },

  loadVerticalScaling(settings) {
    var verticalScalingData;

    settings.cloudType = C.CATEGORIES.CONTAINER;
    verticalScalingData = {
      object_meta:   ObjectMetaBuilder.buildObjectMeta(settings),
      type:          'verticalscaling',
      scale_type:    'AUTOVS',
      state:         'ABLETOSCALE',
      update_policy: { mode: 'auto', },
      spec:          {
        scale_up_wait_time:   5,
        scale_down_wait_time: 5,
        min_resource:         {
          cpu:     '1',
          memory:  '1',
          storage: '1',
        },
        max_resource: {
          cpu:     '2',
          memory:  '2',
          storage: '10',
        },
        metrics: []
      },
      status: {
        last_scale_time:  '',
        current_resource: {
          cpu:     '1',
          memory:  '1 GiB',
          storage: '1 GiB',
        },
        desired_resource: {
          cpu:     '1',
          memory:  '1 GiB',
          storage: '1 GiB',
        },
      },
      target_value: {
        min_target_value_cpu:     40,
        max_target_value_cpu:     80,
        min_target_value_memory:  20,
        max_target_value_memory:  80,
        min_target_value_storage: 20,
        max_target_value_storage: 80,
      },
      vertical_scaling_rule_apply: false,
    };

    return this.get('store').createRecord(verticalScalingData);
  },


  loadStacksFactory(settings) {
    var stacksfactoryData;

    settings.cloudType = C.CATEGORIES.CONTAINER;
    stacksfactoryData = {
      object_meta: ObjectMetaBuilder.buildObjectMeta(settings),
      type:        'stacksfactory',
      replicas:    1,
      resources:   {
        compute_type: settings[denormalizeName(`${ C.SETTING.COMPUTE_TYPE }`)] || D.VPS.computeType,
        storage_type: settings[denormalizeName(`${ C.SETTING.DISK_TYPE }`)] || D.VPS.storageType,
        version:      settings[denormalizeName(`${ C.SETTING.OS_VERSION }`)] || D.VPS.destroVersion,
        cpu:          parseInt(settings[denormalizeName(`${ C.SETTING.CPU_CORE }`)] || D.VPS.cpuCore),
        memory:       parseInt(settings[denormalizeName(`${ C.SETTING.RAM }`)] || D.VPS.ram),
        storage:      parseInt(settings[denormalizeName(`${ C.SETTING.DISK }`)] || D.VPS.storage)
      },
      status:    { phase: '', },
      secret:    { id: '' },
      plan:      '',
      network:   '',
      os:        settings[denormalizeName(`${ C.SETTING.OS_NAME }`)] || D.VPS.destro,
    };

    return this.get('store').createRecord(stacksfactoryData);
  }


});
