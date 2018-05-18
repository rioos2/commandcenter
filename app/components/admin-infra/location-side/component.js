import Ember from 'ember';
import C from 'nilavu/utils/constants';
export default Ember.Component.extend({

name: function(){
return this.get('model.object_meta.name');
}.property('model.object_meta.name'),

currency: function(){
  return this.get('model.currency');
}.property('model.currency'),

status: function(){
  return Ember.isEmpty(this.get('model.status.phase')) ? "": this.get('model.status.phase').capitalize();
}.property('model.status.phase'),

locationAvaliable: function() {
  return !(Ember.isEmpty(this.get('status')) &&  Ember.isEmpty(this.get('name')) && Ember.isEmpty(this.get('currency'))) ;
}.property('status','name','currency'),

});
