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

 loadAssemblyFactory(settings) {
   var assemblyfactoryData;
   settings.cloudType = C.CATEGORIES.MACHINE;
   assemblyfactoryData = {
     object_meta: ObjectMetaBuilder.buildObjectMeta(settings),
     type: 'assemblyfactorys',
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
   return this.get('store').createRecord(assemblyfactoryData);
 }


});
