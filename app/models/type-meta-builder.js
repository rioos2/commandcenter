import EmberObject from '@ember/object';
const TypeMetaBuilder = EmberObject.extend({});

TypeMetaBuilder.reopenClass({

  buildTypeMeta(kind, ver) {
    var typeMeta;

    typeMeta = {
      kind,
      api_version: ver
    };

    return typeMeta;
  },

});
export default TypeMetaBuilder;
