import Resource from 'ember-api-store/models/resource';

var License = Resource.extend({
  type: 'license',

  getLicense: function() {
    return Ember.Object.create({
      license: this.get('store').findAll('license', this.opts('license',true)),
    });
  }
  
});

export default License;
