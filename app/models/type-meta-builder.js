const TypeMetaBuilder = Ember.Object.extend({});

TypeMetaBuilder.reopenClass({

  buildTypeMeta(kind, ver) {
    var typeMeta;
    typeMeta = {
      kind: kind,
      api_version: ver
    };
    return typeMeta;
  },

});
export default TypeMetaBuilder;
