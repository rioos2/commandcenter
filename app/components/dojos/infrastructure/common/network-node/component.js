import Component from '@ember/component';

export default Component.extend({

  name: function(){
    return this.get('node.object_meta.name');
  }.property('node.object_meta.name'),

  ip: function() {
    return this.get('node.node_ip');
  }.property('node.node_ip'),

});
