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
