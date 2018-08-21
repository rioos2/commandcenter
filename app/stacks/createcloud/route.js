import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';
import { xhrConcur } from 'nilavu/utils/platform';
import C from 'nilavu/utils/constants';
import D from 'nilavu/utils/default';
import { denormalizeName } from 'nilavu/utils/denormalize';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { Promise } from 'rsvp';
import EmberObject from '@ember/object';
import { isEmpty } from '@ember/utils';

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
    return this.getSettings(setting)[denormalizeName(`${ C.SETTING.TRUSTED_KEY }`)] || D.VPS.trusted_key;
  },

  // build New secret object

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

  // build New stacksfactory object
  loadStacksFactory(settings) {
    var stacksfactoryData;

    settings.cloudType = C.CATEGORIES.MACHINE;
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
      status:  { phase: '', },
      secret:  { id: '' },
      plan:    '',
      network: '',
      os:      settings[denormalizeName(`${ C.SETTING.OS_NAME }`)] || D.VPS.destro,
    };

    return this.get('store').createRecord(stacksfactoryData);
  }


});
