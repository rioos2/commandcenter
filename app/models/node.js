import Resource from 'ember-api-store/models/resource';
import Ember from 'ember';
var Reports = Resource.extend({
  type: 'node',
  actions: {
  },

  displayName: Ember.computed.alias('name'),


});

export default Reports;
