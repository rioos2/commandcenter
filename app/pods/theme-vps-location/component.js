import Ember from 'ember';
import C from 'nilavu/utils/constants';

export default Ember.Component.extend({

  region: Ember.computed.alias('model.settings.region'),
  showSpinner: false,
  isActive: false,
  addMoreActive: 'inactive',

  initializeChart: Ember.on('didInsertElement', function() {

    var self = this;
    var element = $("#step-3").find(".loc-country");
    if (element.length > 0)
      self.$(".step3").addClass("btn-success");

  }),

  select: function() {
    return C.VPS.LOCATION.DROPDOWNNAME;
  }.property('model'),

  emptyRegion: function() {
    return Ember.isEmpty(this.get('model.datacenters.content'));
  }.property('model.datacenters.content'),

  actions: {

    clickSelect: function(currentActive) {
      this.toggleProperty(currentActive);
    },

    focusOutSelect: function(isActive) {
      if (this.get(isActive)) {
        this.set(isActive, false);
      }
    },

    clickOption: function(data) {
      this.sendAction('done', "step3");
      this.set("model.assemblyfactory.object_meta.cluster_name", data);
      this.set('select', data);
    },

    addMore: function() {
      this.set('addMoreActive', 'active');
    },

    addMoreClose: function() {
      this.set('addMoreActive', 'inactive');
    },
  }

});
