import Component from '@ember/component';

export default Component.extend({

  name: function(){
    return this.get('network.object_meta.name');
  }.property('network.object_meta.name'),

  type: function() {
    return this.get('network.network_type');
  }.property('network.network_type'),

});
