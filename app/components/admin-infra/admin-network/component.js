import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  count: function(){
    return this.get('model.networks.content').length;
  }.property('model.networks.content'),

  NoNetwork: function() {
    return this.get('model.networks.content').length < 0 ? true:false;
  }.property('model'),

  networks: function() {
    return this.get('model.networks.content');
  }.property('model.networks.content'),

});
