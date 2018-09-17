import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import C from 'nilavu/utils/constants';
import { alias } from '@ember/object/computed';
import {
  get, set, computed
} from '@ember/object';

export default Component.extend({
  intl:                   service(),
  notifications:          service('notification-messages'),
  store:                  service(),
  activate:      false,

  stacksfactoryResources: alias('stacksfactory.resources'),

  groupedVms: computed('plans', function() {
    return this.groupingVms();
  }),

  didInsertElement() {
    this.checkPlanEmpty();
    if (!isEmpty(get(this, 'groupedVms'))) {
      let item_found = false;

      get(this, 'groupedVms').forEach((e) => {
        if (e.type === get(this, 'stacksfactory.os')) {
          e.version.forEach((v) => {
            if (v.version === get(this, 'stacksfactoryResources.version')) {
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
      set(this, 'stacksfactory.os', '');
      set(this, 'stacksfactory.plan', '');
      set(this, 'stacksfactoryResources.version', '');
    }
  },

  actions: {

    refreshAfterSelect(item) {
      set(this, 'selected', item);
      this.setDescription(item);
      set(this, 'stacksfactory.current_os_tab', item.type);
      this.toggleProperty('activate');
    },

    navigatorRight() {
      var index = this.indexReader();

      if (index < ((get(this, 'groupedVms')).length) - 1) {
        this.send('refreshAfterSelect', get(this, 'groupedVms')[index + 1]);
        this.setPlan(get(this, 'groupedVms')[index + 1]);
        this.setIcon(get(this, 'groupedVms')[index + 1]);
      }
    },

    navigatorLeft() {
      var index = this.indexReader();

      if (!(index === 0)) {
        this.send('refreshAfterSelect', get(this, 'groupedVms')[index - 1]);
        this.setPlan(get(this, 'groupedVms')[index - 1]);
        this.setIcon(get(this, 'groupedVms')[index - 1]);
      }
    },

    stepDone(){
      this.sendAction('done', 'step5');
    },
  },


  setFirstPlanFactory() {
    let plan = get(this, 'groupedVms')[0];
    let planFirstItem = plan.version[0];

    this.refreshPlan(plan, planFirstItem);
    this.setIcon(plan);
  },

  refreshPlan(plan, planFirstItem) {
    set(this, 'stacksfactory.os', planFirstItem.type);
    set(this, 'stacksfactory.plan', planFirstItem.id);
    set(this, 'stacksfactoryResources.version', planFirstItem.version);
    this.send('refreshAfterSelect', plan);
  },

  checkPlanEmpty(){
    if (isEmpty(get(this, 'groupedVms'))){
      get(this, 'notifications').warning(get(this, 'intl').t('notifications.plan.empty'), {
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
    var planfactory = get(this, 'plans.content');

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
    var types = get(this, 'groupedVms').map((vm) => {
      return vm.type
    })

    return types.indexOf(get(this, 'selected.type'));
  },

  setPlan(plan) {
    let planFirstItem = plan.version[0];

    set(this, 'stacksfactory.os', planFirstItem.type);
    set(this, 'stacksfactory.plan', planFirstItem.id);
    set(this, 'stacksfactoryResources.version', planFirstItem.version);
  },

  setIcon(plan) {
    set(this, 'selectedIcon', plan.icon);
  },

  setDescription(item) {
    let des = (item.version.get('firstObject')).description

    item.version.forEach((v) => {
      if (v.id === get(this, 'stacksfactory.plan')) {
        des = v.description;
      }
    });
    set(this, 'distroDescription', des);
  },

});
