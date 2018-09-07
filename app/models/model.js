import EmberObject from '@ember/object';
import { isEmpty } from '@ember/utils';
const Model = EmberObject.extend();

Model.reopenClass({
  extractByKey(collection, klass) {
    const retval = {};

    if (isEmpty(collection)) {
      return retval;
    }

    collection.forEach((item) => {
      retval[item.id] = klass.create(item);
    });

    return retval;
  }
});

export default Model;
