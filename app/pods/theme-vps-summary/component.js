/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['setup-content'],
  selectionChecker: function() {
    this.set("network", this.get("model.assemblyfactory.network"));
  }.observes('model.assemblyfactory.network'),

  distroNameFromPlan: function() {
    var dn = this.get("model.assemblyfactory.plan").split("/")[3];
    this.set("distroName", dn);
  }.observes('model.assemblyfactory.plan'),

  actions: {
    createAssemblyFactory() {
      this.get('model.assemblyfactory').save();
    },
  }

});
