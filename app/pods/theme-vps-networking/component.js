/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';

export default Ember.Component.extend({

  networks: {
    "private_ipv4": "Private IPv4",
    "public_ipv4": "Public IPv4",
    "private_ipv6": "Private IPv6",
    "public_ipv6": "Public IPv6"
  },

  initializeChart: Ember.on('didInsertElement', function() {
    this.disableNetworks(this.networksFilter(this.get('model.networks.content')));
  }),

  networksFilter: function(networks) {
    var disableNetworks = [];
    for (var k in this.get('networks')) disableNetworks.push(k);

    var filtered = [];
    networks.forEach(function(network) {
      filtered.pushObject(network.network_type);
    }.bind(this));
    filtered = [...new Set(filtered)];

    disableNetworks = disableNetworks.filter(function(el) {
      return filtered.indexOf(el) < 0;
    }.bind(this));
    return disableNetworks;
  },

  disableNetworks: function(disableNetworks=[]) {
    this.set('disabledNetworks', disableNetworks);
    disableNetworks.forEach(function(disable) {
      this.set(disable, "disable-network");
    }.bind(this));
  },

  checkActiveNetwork: function(network) {
    var active = true;
    this.get('disabledNetworks').forEach(function(n) {
      if (n === network) {
        active = false;
      }
    });
    return active;
  },

  actions: {
    selected: function(net_type) {
      if (this.checkActiveNetwork(net_type)) {
        var cc = this.get("model.assemblyfactory.resources");
        if (!cc[net_type]) {
          cc[net_type] = "true";
          this.set(net_type, "selected");
          this.set('model.assemblyfactory.network', net_type);
        } else {
          this.set(net_type, "");
          delete cc[net_type];
          this.set('model.assemblyfactory.network', "");
        }
        this.set("model.assemblyfactory.resources", cc);
      }
    }
  }

});
