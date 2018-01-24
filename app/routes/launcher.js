import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import Config from 'nilavu/mixins/config';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';
import TypeMetaBuilder from 'nilavu/models/type-meta-builder';
import {
  xhrConcur
} from 'nilavu/utils/platform';
import C from 'nilavu/utils/constants';
export function denormalizeName(str) {
  return str.replace(new RegExp('['+C.SETTING.DOT_CHAR+']','g'),'.').toLowerCase();
}

export default Ember.Route.extend(DefaultHeaders, Config, {
  settings    : Ember.inject.service(),


  activate: function() {
    this.send('unfixedTop');
    this.send('unfixedBottom');
  },
  deactivate: function() {
    this.send('unfixedTop');
    this.send('unfixedBottom');
  },
  access: Ember.inject.service(),

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
        assemblyfactory: this.loadAssemblyFactory(),
        secret: this.loadSecret(setting),
        datacenters: hash.datacenters,
        plans: hash.plans,
        settings: setting.all.content.objectAt(0).data,
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

  getSecretType: function (setting) {
    return setting.all.content.objectAt(0).data[denormalizeName(`${C.SETTING.TRUSTED_KEY}`)] || this.defaultVPS().trusted_key;
 },

  loadSecret(setting) {
    alert(this.getSecretType(setting));
    var secretData = {
      type: 'secrets',
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

  loadAssemblyFactory() {
    var assemblyfactoryData;
    assemblyfactoryData = {
      object_meta: ObjectMetaBuilder.buildObjectMeta(),
      type_meta: TypeMetaBuilder.buildTypeMeta("Assembly", "v1"),
      type: 'origins/rioos/assemblyfactorys',
      replicas: 1,
      resources: {
        compute_type: "",
        storage_type: "ssd"
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
      }
    };
    return this.get('store').createRecord(assemblyfactoryData);
  }


});
