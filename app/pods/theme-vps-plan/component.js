import Ember from 'ember';

export default Ember.Component.extend({
  activate: false,
  store: Ember.inject.service(),

  initializeChart: Ember.on('didInsertElement', function() {
    var self = this;
    self.$(".btn-version").click(function(e) {
      self.$(".btn-version").removeClass("active");
      self.$(this).addClass("active");
    });
  }),


  groupedVms: function() {
    return this.groupingVms();
  }.property('model.plans'),

  // stepDone: function() {
  //   if(!Ember.isEmpty(this.get('model.assemblyfactory.resources.version'))) {
  //     this.sendAction('done', "step5");
  //   }
  // },

  groupingVms() {
    var planGroup = [];
    var uniqueVmGroup = [];
    var groupVms = [];
    var planfactory = this.get("model.plans.content");
    planfactory.forEach(function(plan) {
      if (plan.category == "machine" && plan.status.phase == "ready") {
        planGroup.pushObject(plan.object_meta.name);
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
        if (plan.object_meta.name == vm) {
          createVmGroup.item.pushObject(plan);
          createVmGroup.version.pushObject({
            "version": plan.version,
            "id": plan.id,
            "type": plan.object_meta.name
          });
        }
      })
      groupVms.pushObject(createVmGroup);
      createVmGroup = {};
    })
    return groupVms;
  },

  indexReader: function() {
    var types = this.get('groupedVms').map(function(vm) {
      return vm.type
    })
    return types.indexOf(this.get('selected.type'));
  },

  actions: {

    refreshAfterSelect(item) {
      this.set("selected", item);
      this.set("model.assemblyfactory.current_os_tab", item.type);
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

    stepDone(){
      this.sendAction('done', "step5");
    },
  }


});
