import Ember from 'ember';
const {
  get
} = Ember;
import C from 'nilavu/utils/constants';

export default Ember.Component.extend({
  intl: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  activate: false,
  store: Ember.inject.service(),

  didInsertElement() {
    this.checkPlanEmpty();
    if(!Ember.isEmpty(this.get('groupedVms'))) {
      let item_found = false;
      this.get('groupedVms').forEach(function(e){
        if(e.type == this.get('model.assemblyfactory.os')) {
          e.version.forEach(function(v){
              if(v.version == this.get('model.assemblyfactory.resources.version')) {
                  item_found = true;
                  this.refreshPlan(e,v);
              }
          }.bind(this));
        }
      }.bind(this));
      if(!item_found){
        this.setFirstPlanFactory();
      }
    } else {
      this.set('model.assemblyfactory.os', '');
      this.set("model.assemblyfactory.plan", '');
      this.set("model.assemblyfactory.resources.version", '');
    }
  },

  setFirstPlanFactory: function() {
    let plan = this.get('groupedVms')[0];
    let planFirstItem = plan.version[0];
    this.refreshPlan(plan, planFirstItem);
  },

  refreshPlan: function(plan , planFirstItem) {
    this.set('model.assemblyfactory.os', planFirstItem.type);
    this.set("model.assemblyfactory.plan", planFirstItem.id);
    this.set("model.assemblyfactory.resources.version", planFirstItem.version);
    this.send('refreshAfterSelect', plan);
  },

  checkPlanEmpty: function(){
    if(Ember.isEmpty(this.get('groupedVms'))){
      this.get('notifications').warning(get(this, 'intl').t('notifications.plan.empty'), {
        autoClear: true,
        clearDuration: 6000,
        cssClasses:'notification-warning'
      });
    }
  },

  groupedVms: function() {
    return this.groupingVms();
  }.property('model.plans'),

  groupingVms() {
    var planGroup = [];
    var uniqueVmGroup = [];
    var groupVms = [];
    var planfactory = this.get("model.plans.content");
    planfactory.forEach(function(plan) {
      if (plan.category.toLowerCase() === C.CATEGORIES.CONTAINER && plan.status.phase.toLowerCase() === C.PHASE.READY) {
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
        if (plan.object_meta.name == vm && plan.status.phase.toLowerCase() === C.PHASE.READY && plan.category.toLowerCase() === C.CATEGORIES.CONTAINER) {
          createVmGroup.item.pushObject(plan);
          createVmGroup.version.pushObject({
            "version": plan.version,
            "id": plan.id,
            "type": plan.object_meta.name,
            "description": plan.description
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

  setPlan: function(plan) {
    let planFirstItem = plan.version[0];
    this.set('model.assemblyfactory.os', planFirstItem.type);
    this.set("model.assemblyfactory.plan", planFirstItem.id);
    this.set("model.assemblyfactory.resources.version", planFirstItem.version);
  },

  setDescription: function(item) {
    let des = (item.version.get('firstObject')).description
    item.version.forEach(function(v) {
      if (v.id === this.get('model.assemblyfactory.plan')) {
        des = v.description;
      }
    }.bind(this));
    this.set("model.distro_description", des);
  },

  actions: {

    refreshAfterSelect(item) {
      this.set("selected", item);
      this.setDescription(item);
      this.set("model.assemblyfactory.current_os_tab", item.type);
      this.toggleProperty('activate');
    },

    navigatorRight() {
      var index = this.indexReader();
      if (index < ((this.get('groupedVms')).length) - 1) {
        this.send('refreshAfterSelect', this.get('groupedVms')[index + 1]);
        this.setPlan(this.get('groupedVms')[index + 1]);
      }
    },

    navigatorLeft() {
      var index = this.indexReader();
      if (!index == 0) {
        this.send('refreshAfterSelect', this.get('groupedVms')[index - 1]);
        this.setPlan(this.get('groupedVms')[index - 1]);
      }
    },

    stepDone(){
      this.sendAction('done', "step5");
    },
  }


});
