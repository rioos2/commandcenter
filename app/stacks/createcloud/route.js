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
        assemblyfactory: this.loadAssemblyFactory(this.getSettings(setting)),
        secret: this.loadSecret(setting),
        datacenters: hash.datacenters,
        plans: hash.plans,
        settings: this.getSettings(setting),
        networks: hash.networks,
      });
    }).catch((err) => {
      /*return this.loadingError(err, transition, Ember.Object.create({
  plans: [],
  : null,
}));
*/
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
      data: {
        username: "",
        password: "",
        rsa_key: "",
        rsa_pub: "",
        tls_key: "",
        tls_pub: "",
        anykey: "<anykey>"
      },
      object_meta: ObjectMetaBuilder.buildObjectMeta(),
      type_meta: TypeMetaBuilder.buildTypeMeta("Secret", "v1"),
      metadata:{},
    };

    return this.get('store').createRecord(secretData);
  },

  loadAssemblyFactory(settings) {
    var assemblyfactoryData;
    assemblyfactoryData = {
      object_meta: ObjectMetaBuilder.buildObjectMeta(settings),
      type_meta: TypeMetaBuilder.buildTypeMeta("Assembly", "v1"),
      type: 'origins/rioos/assemblyfactorys',
      replicas: 1,
      resources: {
        compute_type: settings[denormalizeName(`${C.SETTING.COMPUTE_TYPE}`)] || D.VPS.computeType,
        storage_type: settings[denormalizeName(`${C.SETTING.DISK_TYPE}`)] || D.VPS.storageType,
        cpu: parseInt(settings[denormalizeName(`${C.SETTING.CPU_CORE}`)] || D.VPS.cpuCore),
        version: settings[denormalizeName(`${C.SETTING.OS_VERSION}`)] || D.VPS.destroVersion
      },
      status: {
        phase: "pending",
        message: "",
        reason: "",
        conditions: [{
          message: "",
          reason: "",
          status: "",
          last_transition_time: "",
          last_probe_time: "",
          condition_type: "",
          last_update_time: ""
        }]
      },
      created_at: "",
      secret: {
        id: ""
      },
      plan: "", //TODO: Need to get from api
      metadata: {
        "io:rioos:orginin::name": "rioos",
        "io:rioos:team::name": "development"
      },
      spec: {
        node_selector: {},
        affinity: {
          "assemblyfactory_affinity": "requiredDuringSchedulingIgnoredDuringExecution"
        },
        restart_policy: "Always"
      },
      network: '',
      os: settings[denormalizeName(`${C.SETTING.OS_NAME}`)] || D.VPS.destro,
      memory: parseInt(settings[denormalizeName(`${C.SETTING.RAM}`)] || D.VPS.ram),
      storage: parseInt(settings[denormalizeName(`${C.SETTING.DISK}`)] || D.VPS.storage)
    };
    return this.get('store').createRecord(assemblyfactoryData);
  }


});
