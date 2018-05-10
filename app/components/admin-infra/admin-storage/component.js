import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  count: function() {
    return this.get('model.storageConnectors.content').length;
  }.property('model'),

  NoStorage: function() {
    return this.get('model.storageConnectors.content').length < 0 ? true:false;
  }.property('model'),

  storages: function() {
    return this.get('model.storageConnectors.content');
  }.property('model'),

});
