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
  showScaleUpTimeEditBox: true,
  showScaleDownTimeEditBox: true,

  didInsertElement() {
    this.set('newUpTime', this.get('model.vscaling.spec.scale_up_wait_time'));
    this.set('newDownTime', this.get('model.vscaling.spec.scale_down_wait_time'));
  },

  btnName: function() {
    return get(this, 'intl').t('stackPage.admin.header.active_btn');
  }.property(),

  validate: function(scaleData) {
    this.set('flag', true);
    if (Ember.isEmpty(scaleData.trim())) {
      this.set('flag', false);
      this.get('notifications').warning(get(this, 'intl').t('launcherPage.scaling.emptyScaling'), {
        autoClear: true,
        clearDuration: 4200,
        cssClasses: 'notification-warning'
      });
    } else
    if (parseInt(scaleData.trim()) != scaleData.trim()) {
      this.set('flag', false);
      this.get('notifications').warning(get(this, 'intl').t('launcherPage.scaling.invalidFormat'), {
        autoClear: true,
        clearDuration: 4200,
        cssClasses: 'notification-warning'
      });
    }
    return this.get('flag');
  },

  actions: {

    setScaleDownTime(newDownTime) {
      this.set('showScaleDownTimeEditBox', true);
      if (this.validate(newDownTime)) {
        this.set("model.hscaling.spec.scale_down_wait_time", parseInt(newDownTime));
      }
    },

    setScaleUpTime(newUpTime) {
      this.set('showScaleUpTimeEditBox', true);
      if (this.validate(newUpTime)) {
        this.set("model.hscaling.spec.scale_up_wait_time", parseInt(newUpTime));
      }
    },

  }

});
