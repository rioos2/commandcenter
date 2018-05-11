import Ember from 'ember';
export default Ember.Component.extend({

name: function(){
  alert(JSON.stringify(this.get('pool')));
  return this.get('pool.object_meta.name');
}.property('pool.object_meta.name'),

});
