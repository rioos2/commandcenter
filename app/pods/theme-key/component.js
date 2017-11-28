/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';
import DefaultVps from 'nilavu/models/default-vps';

export default Ember.Component.extend({

  key: DefaultVps.secret,
  tagName: '',

  initializeChart: Ember.on('didInsertElement', function() {
    if (DefaultVps.secret == this.get('key')) {
      this.sendAction('getSecretType', this.get('key'));
      this.set("active", "selected");
    }
  }),

  selectionChecker: function() {
    var check = this.get("secretType") == this.get("key");
    if (check) {
      this.set("active", "selected");
    } else {
      this.set("active", "");
    }
  }.observes('activate'),

  actions: {
    sendType() {
      this.sendAction('getSecretType', this.get('key'));
    },
  }
});
