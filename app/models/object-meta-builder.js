const ObjectMetaBuilder = Ember.Object.extend({});

ObjectMetaBuilder.reopenClass({

  buildObjectMeta() {
    var objectMeta;

    objectMeta = {
      name: "",
      uid: " ",
      created_at: "",
      cluster_name: "",
      labels: {
        rioos_category: "machine",
        rioos_environment: "development"
      },
      annotations: {
        key1: "value1",
        key2: "value2"
      },
      owner_references: [{
        kind: "AssemblyFactory",
        api_version: "v1",
        name: "abc",
        uid: "",
        block_owner_deletion: true
      }],
      account:"",
      deleted_at:"",
      deletion_grace_period_seconds:0,
      finalizers:[]
    };
    return objectMeta;
  },

});
export default ObjectMetaBuilder;
