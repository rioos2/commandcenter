/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';

export default Ember.Component.extend(DefaultHeaders,{
  session: Ember.inject.service(),

  selectionChecker: function() {
    this.set("network", this.get("model.assemblyfactory.network"));
  }.observes('model.assemblyfactory.network'),

  distroNameFromPlan: function() {
    var dn = this.get("model.assemblyfactory.plan").split("/")[3];
    return dn;
  }.property('model.assemblyfactory.plan'),

  actions: {
    createAssemblyFactory() {
      this.set('showSpinner', true);

      var session = this.get("session");
      var origin = this.get("session").get("origin");
      this.set('model.assemblyfactory.object_meta', ObjectMetaBuilder.buildObjectMeta("", origin));
      var url = 'origins/' + origin +'/assemblyfactorys';

      this.get('model.assemblyfactory').save(this.opts(url)).then(() => {
        location.reload();
        }).catch(err => {
          this.get('notifications').error('Launch failed.', {});
          this.set('showSpinner', false);
        });
    },
  }

});
