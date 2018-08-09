import Component from '@ember/component';
import { isEqual } from '@ember/utils';

export default Component.extend({

  virtualNetworkName: function(){
    return this.get('model.object_meta.name');
  }.property('model.object_meta.name'),

  ip: function() {
    return this.get('model.subnet_ip');
  }.property('model.subnet_ip'),

  type: function() {
    return this.get('model.network_type');
  }.property('model.network_type'),

  active: function() {
    return isEqual(this.get('selectedVirtualNetwork'), this.get('model.id')) ? 'active' : '';
  }.property('selectedVirtualNetwork'),
});
