import Component from '@ember/component';
import { isEmpty } from '@ember/utils';

export default Component.extend({

  name: function(){
    return this.get('model.object_meta.name');
  }.property('model.object_meta.name'),

  country: function(){
    return !isEmpty(this.get('model.advanced_settings.country')) ? this.get('model.advanced_settings.country') : '';
  }.property('model.advanced_settings.country'),

  status: function(){
    return isEmpty(this.get('model.status.phase')) ? '' : this.get('model.status.phase').capitalize();
  }.property('model.status.phase'),

  locationAvaliable: function() {
    return !(isEmpty(this.get('status')) &&  isEmpty(this.get('name')) && isEmpty(this.get('currency'))) ;
  }.property('status', 'name', 'currency'),

});
