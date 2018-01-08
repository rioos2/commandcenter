import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';
import TypeMetaBuilder from 'nilavu/models/type-meta-builder';
import {
  xhrConcur
} from 'nilavu/utils/platform';

export default Ember.Route.extend(DefaultHeaders, {
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

    let promise = new Ember.RSVP.Promise((resolve, reject) => {
      let tasks = {
        plans: this.cbFind('planfactory', 'plans'),
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
        secret: this.loadSecret(),
        plans: hash.plans,
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

  loadSecret() {
    var secretData = {
      type: 'secrets',
      secret_type: 'rio.digital/ssh-auth',
      data: {
        username: "USERNAME",
        password: "PASSWORD",
        rsa_key: "PRIVATEKEY",
        rsa_pub: "PUBLICKEY",
        tls_key: "PRIVATEKEY",
        tls_pub: "PUBLICKEY",
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
