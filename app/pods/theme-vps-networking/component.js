/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';
import DefaultVps from 'nilavu/models/default-vps';

export default Ember.Component.extend({

  networks: {
    "private_ipv4": "Private IPv4",
    "public_ipv4": "Public IPv4",
    "private_ipv6": "Private IPv6",
    "public_ipv6": "Public IPv6"
  },

  initializeChart: Ember.on('didInsertElement', function() {
    this.set(DefaultVps.network, "selected");
    var cc = this.get("model.assemblyfactory.component_collection");
    cc[DefaultVps.network] = "true";
    this.set("model.assemblyfactory.component_collection", cc);
    this.set("model.assemblyfactory.network", this.get("networks")[DefaultVps.network]);
  }),

  selectionChecker: function() {
    var cc = this.get("model.assemblyfactory.component_collection");
    this.set("private_ipv4", "");
    delete cc["private_ipv4"];
    this.set("public_ipv4", "");
    delete cc["public_ipv4"];
    this.set("private_ipv6", "");
    delete cc["private_ipv6"];
    this.set("public_ipv6", "");
    delete cc["public_ipv6"];
    this.set("model.assemblyfactory.component_collection", cc);
  },

  actions: {
    selected: function(net_type) {
      this.selectionChecker();
      this.set(net_type, "selected");
      var cc = this.get("model.assemblyfactory.component_collection");
      cc[net_type] = "true";
      this.set("model.assemblyfactory.component_collection", cc);
      this.set("model.assemblyfactory.network", this.get("networks")[net_type]);
    }
  }

});
