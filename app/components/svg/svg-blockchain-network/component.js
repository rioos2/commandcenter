import Ember from 'ember';
import C from 'nilavu/utils/constants';
import D from 'nilavu/utils/default';
import { denormalizeName } from 'nilavu/utils/denormalize';

export default Ember.Component.extend({

  tagName: '',
  active: 'cpu-ico blknetwork',

  selectionChecker: function() {
    var check = this.get("model.assemblyfactory.metadata.rioos_sh_blockchain_network_id") == this.get("network.id");
    if (check) {
      this.set("active", "cpu-ico blknetwork selected");
    } else {
      this.set("active", "cpu-ico blknetwork");
    }
  }.observes('activate'),

  name: function(){
    return this.get('network.object_meta.name');
  }.property('network'),

  actions: {
    selected() {
      this.sendAction('refreshAfterAction', this.get('network'));
    },
  }

});
