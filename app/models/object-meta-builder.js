const ObjectMetaBuilder = Ember.Object.extend({});

ObjectMetaBuilder.reopenClass({

  buildObjectMeta(name, origin) {
    var objectMeta;

    objectMeta = {
      name: name,
      origin: origin,
      uid: " ",
      created_at: "",
      cluster_name: "",
      labels: {
        group: "deployment"
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
      }]

    };
    return objectMeta;
  },

});
export default ObjectMetaBuilder;
