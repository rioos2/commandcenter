import Component from '@ember/component';
import {
  inject as service
} from '@ember/service';
import {
  isEmpty
} from '@ember/utils';
import C from 'nilavu/utils/constants';
import {
  alias
} from '@ember/object/computed';
import {
  get,
  set,
  computed
} from '@ember/object';

export default Component.extend({
  intl: service(),
  notifications: service('notification-messages'),
  store: service(),
  activate: false,

  stacksfactoryResources: alias('stacksfactory.resources'),

  groupedVms: computed('plans', function() {
    return this.groupingVms();
  }),

  didInsertElement() {
    this.checkPlanEmpty();
    if (!isEmpty(this.get('groupedVms'))) {
      let item_found = false;

      this.get('groupedVms').forEach((e) => {
        if (e.type === this.get('stacksfactory.os')) {
          e.version.forEach((v) => {
            if (v.version === this.get('stacksfactoryResources.version')) {
              item_found = true;
              this.refreshPlan(e, v);
            }
          });
        }
      });
      if (!item_found) {
        this.setFirstPlanFactory();
      }
    } else {
      this.set('stacksfactory.os', '');
      this.set('stacksfactory.plan', '');
      this.set('stacksfactoryResources.version', '');
    }
  },

  actions: {

    refreshAfterSelect(item) {
      this.set('selected', item);
      this.setDescription(item);
      this.set('stacksfactory.current_os_tab', item.type);
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

    stepDone() {
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
    this.set('stacksfactory.os', planFirstItem.type);
    this.set('stacksfactory.plan', planFirstItem.id);
    this.set('stacksfactoryResources.version', planFirstItem.version);
    this.send('refreshAfterSelect', plan);
  },

  setIcon(plan) {
    this.set('selectedIcon', plan.icon);
  },

  checkPlanEmpty() {
    if (isEmpty(this.get('groupedVms'))) {
      this.get('notifications').warning(get(this, 'intl').t('notifications.plan.empty'), {
        autoClear: true,
        clearDuration: 6000,
        cssClasses: 'notification-warning'
      });
    }
  },

  groupingVms() {
    var planGroup = [];
    var uniqueVmGroup = [];
    var groupVms = [];
    var planfactory = this.get('plans.content');
    planfactory.forEach((plan) => {
      if (plan.category.toLowerCase() === C.CATEGORIES.CONTAINER && plan.status.phase.toLowerCase() === C.PHASE.READY) {
        planGroup.pushObject(plan.object_meta.name);
      }
      uniqueVmGroup = planGroup.filter((elem, index, self) => {
        return index === self.indexOf(elem);
      })
    });
    uniqueVmGroup.forEach((vm) => {
      let createVmGroup = {
        'type': vm,
        'icon': '',
        'version': [],
        'item': []
      }

      planfactory.forEach((plan) => {
        if (plan.object_meta.name === vm && plan.status.phase.toLowerCase() === C.PHASE.READY && plan.category.toLowerCase() === C.CATEGORIES.CONTAINER) {
          createVmGroup.item.pushObject(plan);
          createVmGroup.icon = plan.icon;
          createVmGroup.version.pushObject({
            'version': plan.version,
            'id': plan.id,
            'type': plan.object_meta.name,
            'icon': plan.icon,
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

    this.set('stacksfactory.os', planFirstItem.type);
    this.set('stacksfactory.plan', planFirstItem.id);
    this.set('stacksfactoryResources.version', planFirstItem.version);
  },

  setDescription(item) {
    let des = (item.version.get('firstObject')).description

    item.version.forEach((v) => {
      if (v.id === this.get('stacksfactory.plan')) {
        des = v.description;
      }
    });
    this.set('distroDescription', des);
  },

});