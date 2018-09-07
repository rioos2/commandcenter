import Ember from 'ember';
import C from 'nilavu/utils/constants';
export default Ember.Component.extend({

name: function(){
return this.get('model.object_meta.name');
}.property('model.object_meta.name'),

country: function(){
  return !Ember.isEmpty(this.get('model.advanced_settings.country'))? this.get('model.advanced_settings.country') : "";
}.property('model.advanced_settings.country'),

status: function(){
  return Ember.isEmpty(this.get('model.status.phase')) ? "": this.get('model.status.phase').capitalize();
}.property('model.status.phase'),

locationAvaliable: function() {
  return !(Ember.isEmpty(this.get('status')) &&  Ember.isEmpty(this.get('name')) && Ember.isEmpty(this.get('currency'))) ;
}.property('status','name','currency'),

});
