/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';


export default Ember.Component.extend({
  activate: false,
  store: Ember.inject.service(),

  initializeChart: Ember.on('didInsertElement', function() {
    var self = this;
    self.$(".step4").addClass("btn-success");
    self.$(".btn-version").click(function(e) {
      self.$(".btn-version").removeClass("active");
      self.$(this).addClass("active");
    });
  }),


  groupedVms: function() {
    var planGroup = [];
    var uniqueVmGroup = [];
    var groupVms = [];
    var planfactory = this.get("model.plans.content");

    planfactory.forEach(function(plan) {
      if (plan.group_name.split("_")[1] == "virtualmachine") {
        planGroup.pushObject(plan.group_name.split("_")[2]);
      }
      uniqueVmGroup = planGroup.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
      })
    });
    uniqueVmGroup.forEach(function(vm) {
      let createVmGroup = {
        "type": vm,
        "version": [],
        "item": []
      }
      planfactory.forEach(function(plan) {
        if (plan.group_name.split("_")[2] == vm) {
          createVmGroup.item.pushObject(plan);
          createVmGroup.version.pushObject({
            "version": plan.services[0].characteristics.version,
            "url": plan.url,
            "type": plan.group_name.split("_")[2]
          });
        }
      })
      groupVms.pushObject(createVmGroup);
      createVmGroup = {};
    })
    return groupVms;
  }.property('model.plans'),

  indexReader: function() {
    var types = this.get('groupedVms').map(function(vm) {
      return vm.type
    })
    return types.indexOf(this.get('selected.type'));
  },

  actions: {

    refreshAfterSelect(item) {
      this.set("selected", item);
      this.set("model.assemblyfactory.os", item.type);
      this.toggleProperty('activate');
    },

    navigatorRight() {
      var index = this.indexReader();
      if (index < ((this.get('groupedVms')).length) - 1) {
        this.send('refreshAfterSelect', this.get('groupedVms')[index + 1]);
      }
    },

    navigatorLeft() {
      var index = this.indexReader();
      if (!index == 0) {
        this.send('refreshAfterSelect', this.get('groupedVms')[index - 1]);
      }
    },
  }


});
