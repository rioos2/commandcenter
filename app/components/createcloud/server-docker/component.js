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
        if(e.type == this.get('model.stacksfactory.os')) {
          e.version.forEach(function(v){
              if(v.version == this.get('model.stacksfactory.resources.version')) {
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
      this.set('model.stacksfactory.os', '');
      this.set("model.stacksfactory.plan", '');
      this.set("model.stacksfactory.resources.version", '');
    }
  },

  setFirstPlanFactory: function() {
    let plan = this.get('groupedVms')[0];
    let planFirstItem = plan.version[0];
    this.refreshPlan(plan, planFirstItem);
    this.setIcon(plan);
  },

  refreshPlan: function(plan , planFirstItem) {
    this.set('model.stacksfactory.os', planFirstItem.type);
    this.set("model.stacksfactory.plan", planFirstItem.id);
    this.set("model.stacksfactory.resources.version", planFirstItem.version);
    this.send('refreshAfterSelect', plan);
  },

  setIcon: function(plan) {
    let planFirstItem = plan.version[0];
    this.set('model.selected_icon', plan.icon);
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
        "icon": "",
        "version": [],
        "item": []
      }
      planfactory.forEach(function(plan) {
        if (plan.object_meta.name == vm && plan.status.phase.toLowerCase() === C.PHASE.READY && plan.category.toLowerCase() === C.CATEGORIES.CONTAINER) {
          createVmGroup.item.pushObject(plan);
          createVmGroup.icon = plan.icon;
          createVmGroup.version.pushObject({
            "version": plan.version,
            "id": plan.id,
            "type": plan.object_meta.name,
            "icon": plan.icon,
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
    this.set('model.stacksfactory.os', planFirstItem.type);
    this.set("model.stacksfactory.plan", planFirstItem.id);
    this.set("model.stacksfactory.resources.version", planFirstItem.version);
  },

  setDescription: function(item) {
    let des = (item.version.get('firstObject')).description
    item.version.forEach(function(v) {
      if (v.id === this.get('model.stacksfactory.plan')) {
        des = v.description;
      }
    }.bind(this));
    this.set("model.distro_description", des);
  },

  actions: {

    refreshAfterSelect(item) {
      this.set("selected", item);
      this.setDescription(item);
      this.set("model.stacksfactory.current_os_tab", item.type);
      this.toggleProperty('activate');
    },

    navigatorRight() {
      var index = this.indexReader();
      if (index < ((this.get('groupedVms')).length) - 1) {
        this.send('refreshAfterSelect', this.get('groupedVms')[index + 1]);
        this.setPlan(this.get('groupedVms')[index + 1]);
        this.setIcon(this.get('groupedVms')[index + 1]);
      }
    },

    navigatorLeft() {
      var index = this.indexReader();
      if (!index == 0) {
        this.send('refreshAfterSelect', this.get('groupedVms')[index - 1]);
        this.setPlan(this.get('groupedVms')[index - 1]);
        this.setIcon(this.get('groupedVms')[index - 1]);
      }
    },

    stepDone(){
      this.sendAction('done', "step5");
    },
  }


});
