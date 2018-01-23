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

    this.set(this.get('model.settings.network'), "selected");
    var cc = this.get("model.assemblyfactory.resources");
    cc[this.get('model.settings.network')] = "true";
    this.set("model.assemblyfactory.resources", cc);
    this.set("model.assemblyfactory.network", this.get("networks")[this.get('model.settings.network')]);
    this.sendAction('done', "step6");
  }),


  actions: {
    selected: function(net_type) {
      //

      var cc = this.get("model.assemblyfactory.resources");
      if(!cc[net_type]){
        cc[net_type] = "true";
        this.set(net_type, "selected");
        this.sendAction('done', "step6");
      }
      else
      {
        this.set(net_type, "");
        delete cc[net_type];
      }
      this.set("model.assemblyfactory.resources", cc);
        this.set("model.assemblyfactory.network", net_type);
    }
  }

});
