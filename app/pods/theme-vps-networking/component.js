/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['setup-content'],

  networks: { "private_ipv4": "Private IPv4", "public_ipv4": "Public IPv4", "private_ipv6": "Private IPv6", "public_ipv6": "Public IPv6" },

  selectionChecker: function() {
    this.set("private_ipv4", "");
    this.set("public_ipv4", "");
    this.set("private_ipv6", "");
    this.set("public_ipv6", "");
  },

  actions: {
    selected: function(net_type) {
      this.selectionChecker();
      this.set(net_type, "selected");
      var cc = this.get("model.assemblyfactory.component_collection");
      cc[net_type] = true;
      this.set("model.assemblyfactory.component_collection", cc);
      this.set("model.assemblyfactory.network", this.get("networks")[net_type]);
    }
  }

});
