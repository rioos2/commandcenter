/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';

export default Ember.Component.extend({
  selectionChecker: function() {
    this.set("network", this.get("model.assemblyfactory.network"));
  }.observes('model.assemblyfactory.network'),

  distroNameFromPlan: function() {
    var dn = this.get("model.assemblyfactory.plan").split("/")[3];
    return dn;
  }.property('model.assemblyfactory.plan'),

  actions: {
    createAssemblyFactory() {
      this.get('model.assemblyfactory').save();
    },
  }

});
