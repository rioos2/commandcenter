import { get } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import C from 'nilavu/utils/constants';
import { alias } from '@ember/object/computed';

export default Component.extend({
  intl:          service(),
  notifications: service('notification-messages'),
  store:         service(),
  activate:      false,

  groupedVms: function() {
    return this.groupingVms();
  }.property('model.plans'),

  didInsertElement() {
    this.checkPlanEmpty();
    if (!isEmpty(this.get('groupedVms'))) {
      let item_found = false;

      this.get('groupedVms').forEach((e) => {
        if (e.type === this.get('model.stacksfactory.os')) {
          e.version.forEach((v) => {
            if (v.version === this.get('model.stacksfactory.resources.version')) {
              item_found = true;
              this.refreshPlan(e, v);
            }
          });
        }
      });
      if (!item_found){
        this.setFirstPlanFactory();
      }
    } else {
      this.set('model.stacksfactory.os', '');
      this.set('model.stacksfactory.plan', '');
      this.set('model.stacksfactory.resources.version', '');
    }
  },

  actions: {

    refreshAfterSelect(item) {
      this.set('selected', item);
      this.setDescription(item);
      this.set('model.stacksfactory.current_os_tab', item.type);
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

      if (!(index === 0)) {
        this.send('refreshAfterSelect', this.get('groupedVms')[index - 1]);
        this.setPlan(this.get('groupedVms')[index - 1]);
        this.setIcon(this.get('groupedVms')[index - 1]);
      }
    },

    stepDone(){
      this.sendAction('done', 'step5');
    },
  },


  setFirstPlanFactory() {
    let plan = this.get('groupedVms')[0];
    let planFirstItem = plan.version[0];

    this.refreshPlan(plan, planFirstItem);
    this.setIcon(plan);
  },

  refreshPlan(plan, planFirstItem) {
    this.set('model.stacksfactory.os', planFirstItem.type);
    this.set('model.stacksfactory.plan', planFirstItem.id);
    this.set('model.stacksfactory.resources.version', planFirstItem.version);
    this.send('refreshAfterSelect', plan);
  },

  checkPlanEmpty(){
    if (isEmpty(this.get('groupedVms'))){
      this.get('notifications').warning(get(this, 'intl').t('notifications.plan.empty'), {
        autoClear:     true,
        clearDuration: 6000,
        cssClasses:    'notification-warning'
      });
    }
  },

  groupingVms() {
    var planGroup = [];
    var uniqueVmGroup = [];
    var groupVms = [];
    var planfactory = this.get('model.plans.content');

    planfactory.forEach((plan) => {
      if (plan.category.toLowerCase() === C.CATEGORIES.MACHINE && plan.status.phase.toLowerCase() === C.PHASE.READY) {
        planGroup.pushObject(plan.object_meta.name);
      }
      uniqueVmGroup = planGroup.filter((elem, index, self) => {
        return index === self.indexOf(elem);
      })
    });
    uniqueVmGroup.forEach((vm) => {
      let createVmGroup = {
        'type':    vm,
        'icon':    '',
        'version': [],
        'item':    []
      }

      planfactory.forEach((plan) => {
        if (plan.object_meta.name === vm && plan.status.phase.toLowerCase() === C.PHASE.READY && plan.category.toLowerCase() === C.CATEGORIES.MACHINE) {
          createVmGroup.item.pushObject(plan);
          createVmGroup.icon = plan.icon;
          createVmGroup.version.pushObject({
            'version':     plan.version,
            'id':          plan.id,
            'type':        plan.object_meta.name,
            'description': plan.description
          });
        }
      })
      groupVms.pushObject(createVmGroup);
      createVmGroup = {};
    })

    return groupVms;
  },

  indexReader() {
    var types = this.get('groupedVms').map((vm) => {
      return vm.type
    })

    return types.indexOf(this.get('selected.type'));
  },

  setPlan(plan) {
    let planFirstItem = plan.version[0];

    this.set('model.stacksfactory.os', planFirstItem.type);
    this.set('model.stacksfactory.plan', planFirstItem.id);
    this.set('model.stacksfactory.resources.version', planFirstItem.version);
  },

  setIcon(plan) {
    this.set('model.selected_icon', plan.icon);
  },

  setDescription(item) {
    let des = (item.version.get('firstObject')).description

    item.version.forEach((v) => {
      if (v.id === this.get('model.stacksfactory.plan')) {
        des = v.description;
      }
    });
    this.set('model.distro_description', des);
  },

});
