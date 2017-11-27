import Ember from 'ember';
// import PolledModel from 'nilavu/mixins/polled-model';
// import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';
import TypeMetaBuilder from 'nilavu/models/type-meta-builder';


export default Ember.Route.extend( /*PolledModel,DefaultHeaders,*/ {
  activate: function() {
    this.send('unfixedTop');
    this.send('unfixedBottom');
  },
  deactivate: function() {
    this.send('unfixedTop');
    this.send('unfixedBottom');
  },
  access: Ember.inject.service(),

  model: function() {
    var store = this.get('store');

    var assemblyfactoryData;
    // var secretData;
    assemblyfactoryData = {
      object_meta: ObjectMetaBuilder.buildObjectMeta("", "rioos"),
      type_meta: TypeMetaBuilder.buildTypeMeta("Assembly", "v1"),
      type: 'rioos/assemblyfactorys',

      name: "",
      uri: "",
      description: "installation",
      tags: [],
      origin: "rioos",
      replicas: 1,
      properties: {
        domain: "",
        cloudsetting: "/clouds/one",
        region: "",
        storage_type: "ssd"
      },
      plan: "/v3/plan/ubuntu",
      external_management_resource: [
        ""
      ],
      component_collection: {
        flavor: "/url",
        network: "/url"
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
          condition_type: ""
        }]
      },
      opssettings: {
        nodeselector: "",
        priority: "",
        nodename: "",
        restartpolicy: ""
      }
    };


    // secretData = {
    //   type: 'secret',
    //   secret_type: "root",
    //   data: {
    //     username: "USERNAME",
    //     password: "PASSWORD",
    //     rsa_key: "PRIVATEKEY",
    //     rsa_pub: "PUBLICKEY",
    //     tls_key: "PRIVATEKEY",
    //     tls_pub: "PUBLICKEY",
    //     anykey: "<anykey>"
    //   },
    //   object_meta: ObjectMetaBuilder.buildObjectMeta("", "rioos"),
    //   type_meta: TypeMetaBuilder.buildTypeMeta("Secret", "v1")
    // };

    var assemblyfactory = store.createRecord(assemblyfactoryData);
    // var secret = store.createRecord(secretData);

    return Ember.Object.create({
      assemblyfactory: assemblyfactory
      /*,
            secret: secret*/
    });

  },

});
