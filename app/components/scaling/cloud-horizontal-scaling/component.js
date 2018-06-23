import Component from '@ember/component';
import C from 'nilavu/utils/constants';
const {
  get
} = Ember;

export default Component.extend({
  intl: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),

  selectedTab: 'cpu',
  panels: [],
  modelSpinner: false,
  showScaleUpTime: true,
  showMaxReplicas: true,
  showMinReplicas: true,
  showScaleDownTime: true,

  didInsertElement() {
    this.set('newMinReplicas',this.get('model.hscaling.spec.min_replicas'));
    this.set('newMaxReplicas',this.get('model.hscaling.spec.max_replicas'));
    this.set('newUpTime',this.get('model.hscaling.spec.scale_up_wait_time'));
    this.set('newDownTime',this.get('model.hscaling.spec.scale_down_wait_time'));
  },

  validate: function(scaleData) {
    this.set('flag',true);
    if (Ember.isEmpty(scaleData.trim())) {
      this.set('flag',false);
      this.get('notifications').warning(get(this, 'intl').t('launcherPage.scaling.emptyScaling'), {
        autoClear: true,
        clearDuration: 4200,
        cssClasses: 'notification-warning'
      });
    } else
    if (parseInt(scaleData.trim()) != scaleData.trim()) {
      this.set('flag',false);
      this.get('notifications').warning(get(this, 'intl').t('launcherPage.scaling.invalidFormat'), {
        autoClear: true,
        clearDuration: 4200,
        cssClasses: 'notification-warning'
      });
    }
    return this.get('flag');
  },

  actions: {
    clickDownTime() {
      this.set('showScaleDownTime', false);
    },
    clickUpTime() {
      this.set('showScaleUpTime', false);
    },
    clickMinReplicas() {
      this.set('showMinReplicas', false);
    },
    clickMaxReplicas() {
      this.set('showMaxReplicas', false);
    },


    setMinReplicas(newMinReplicas) {
      this.set('showMinReplicas', true);
      if (this.validate(newMinReplicas)) {
        this.set("model.hscaling.spec.min_replicas", newMinReplicas);
      }

    },
    setMaxReplicas(newMaxReplicas) {
      this.set('showMaxReplicas', true);
      if (this.validate(newMaxReplicas)) {
        this.set("model.hscaling.spec.max_replicas", newMaxReplicas);
      }
    },
    setScaleDownTime(newDownTime) {
      this.set('showScaleDownTime', true);
      if (this.validate(newDownTime)) {
        this.set("model.hscaling.spec.scale_down_wait_time", newDownTime);
      }
    },

    setScaleUpTime(newUpTime) {
      this.set('showScaleUpTime', true);
      if (this.validate(newUpTime)) {
        this.set("model.hscaling.spec.scale_up_wait_time", newUpTime);
      }
    },

    focusOut() {
      this.set('showIcon', true);
    },

    sendType() {
      this.toggleProperty('model.hscaling.scaling_rule_apply');
    },
  }

});
