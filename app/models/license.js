import Resource from 'ember-api-store/models/resource';
import EmberObject from '@ember/object';

var License = Resource.extend({
  type: 'license',

  getLicense() {
    return EmberObject.create({ license: this.get('store').findAll('license', this.opts('license', true)), });
  }

});

export default License;
