import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';
import TypeMetaBuilder from 'nilavu/models/type-meta-builder';
import {
  xhrConcur
} from 'nilavu/utils/platform';
import C from 'nilavu/utils/constants';
import D from 'nilavu/utils/default';
import { denormalizeName } from 'nilavu/utils/denormalize';
const { get } = Ember;


export default Ember.Route.extend(DefaultHeaders,  {
  settings    : Ember.inject.service(),
  access: Ember.inject.service(),
  router: Ember.inject.service(),
  model() {
    let setting = this.get('settings');
      let promise = new Ember.RSVP.Promise((resolve, reject) => {
      let tasks = {
        datacenters: this.cbFind('datacenter', 'datacenters'),
        plans: this.cbFind('planfactory', 'plans'),
        networks: this.cbFind('network', 'networks'),
      };

      async.auto(tasks, xhrConcur, function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    }, 'Load all the things');

    return promise.then((hash) => {
      return Ember.Object.create({
        stacksfactory: this.loadStacksFactory(this.getSettings(setting)),
        hscaling: this.loadHorizontalScaling(this.getSettings(setting)),
        secret: this.loadSecret(setting),
        datacenters: hash.datacenters,
        plans: hash.plans,
        settings: this.getSettings(setting),
        networks: hash.networks,
      });
    });
  },

  cbFind(type, url) {
    return (results, cb) => {
      if (typeof results === 'function') {
        cb = results;
        results = null;
      }

      return this.get('store').findAll(type, this.opts(url)).then(function(res) {
        cb(null, res);
      }).catch(function(err) {
        cb(err, null);
      });
    };
  },

  getSettings: function(data){
    return Ember.isEmpty(data.all.content)? {} : data.all.content.objectAt(0).data;
  },

  getSecretType: function (setting) {
    return this.getSettings(setting)[denormalizeName(`${C.SETTING.TRUSTED_KEY}`)] || D.VPS.trusted_key;
 },

  loadSecret(setting) {
    var secretData = {
      type: 'secret',
      secret_type: this.getSecretType(setting),
      data: {},
      object_meta: ObjectMetaBuilder.buildObjectMeta(),
      metadata:{},
    };

    return this.get('store').createRecord(secretData);
  },

  loadHorizontalScaling(settings) {
    var horizontalScalingData;
    settings.cloudType = C.CATEGORIES.CONTAINER;

    horizontalScalingData = {
      object_meta: ObjectMetaBuilder.buildObjectMeta(settings),
      type: 'horizontalscaling',
      scale_type: 'AUTOHS',
      state: 'ABLETOSCALE',
      spec: {
      min_replicas: 1,
      max_replicas: 0,
      scale_up_wait_time: 5,
      scale_down_wait_time: 5,
      metrics: []
    },
    status: {
      last_scale_time: "",
      current_replicas: 1,
      desired_replicas: 0
    },
    target_value: {
      min_target_value_cpu: 0,
      max_target_value_cpu: 0,
      min_target_value_memory: 0,
      max_target_value_memory: 0,
      min_target_value_disk: 0,
      max_target_value_disk: 0
    }
    };
    return this.get('store').createRecord(horizontalScalingData);
  },


  loadStacksFactory(settings) {
    var stacksfactoryData;
    settings.cloudType = C.CATEGORIES.CONTAINER;
    stacksfactoryData = {
      object_meta: ObjectMetaBuilder.buildObjectMeta(settings),
      type: 'stacksfactory',
      replicas: 1,
      resources: {
        compute_type: settings[denormalizeName(`${C.SETTING.COMPUTE_TYPE}`)] || D.VPS.computeType,
        storage_type: settings[denormalizeName(`${C.SETTING.DISK_TYPE}`)] || D.VPS.storageType,
        version: settings[denormalizeName(`${C.SETTING.OS_VERSION}`)] || D.VPS.destroVersion,
        cpu: parseInt(settings[denormalizeName(`${C.SETTING.CPU_CORE}`)] || D.VPS.cpuCore),
        memory: parseInt(settings[denormalizeName(`${C.SETTING.RAM}`)] || D.VPS.ram),
        storage: parseInt(settings[denormalizeName(`${C.SETTING.DISK}`)] || D.VPS.storage)
      },
      status: {
        phase: "",
      },
      secret: {
        id: ""
      },
      plan: "",
      network: '',
      os: settings[denormalizeName(`${C.SETTING.OS_NAME}`)] || D.VPS.destro,
    };
    return this.get('store').createRecord(stacksfactoryData);
  }


});
