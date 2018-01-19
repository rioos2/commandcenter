/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';

export default Ember.Component.extend(DefaultHeaders,{
  session: Ember.inject.service(),
  // NetworkData:[],
  networks: {
    "private_ipv4": "Private IPv4",
    "public_ipv4": "Public IPv4",
    "private_ipv6": "Private IPv6",
    "public_ipv6": "Public IPv6"
  },

  selectionChecker: function() {
    alert("observe");
    const self =this;
    Object.keys(self.get("model.assemblyfactory.resources")).filter(function(k){
      if(k.startsWith("p", 0)){
        self.get('NetworkData').addObject(self.get("networks")[k]);
      }
    });
    self.set("Network", self.get('NetworkData').toString());
    if(self.get('NetworkData').length > 1){
      alert("net set");
      self.set("network", self.get("NetworkData").objectAt(0));
    }
  }.observes('model.assemblyfactory.network'),


  distroNameFromPlan: function() {
    return this.get("model.assemblyfactory.os");
  }.property('model.assemblyfactory.os'),

  actions: {
    createAssemblyFactory() {
      this.set('showSpinner', true);

      var session = this.get("session");
      var id = this.get("session").get("id");
      this.set("model.assemblyfactory.object_meta.account", id);
      var url = 'accounts/' + id + '/assemblyfactorys';

      this.get('model.assemblyfactory').save(this.opts(url)).then(() => {
        location.reload();
        }).catch(err => {
          this.get('notifications').error('Launch failed.', {});
          this.set('showSpinner', false);
        });
    },
  }

});
