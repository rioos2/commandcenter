import Component from '@ember/component';
import { isEmpty } from '@ember/utils';

export default Component.extend({

  name: function(){
    return this.get('bridge.bridge_name');
  }.property('bridge.bridge_name'),

  type: function() {
    return isEmpty(this.get('bridge.bridge_type')) ? '' : this.get('bridge.bridge_type').capitalize();
  }.property('bridge.bridge_type'),

});
