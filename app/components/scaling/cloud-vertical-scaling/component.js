import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  intl:          service(),
  notifications: service('notification-messages'),

  selectedTab:              'cpu',
  panels:                   [],
  showScaleUpTimeEditBox:   true,
  showScaleDownTimeEditBox: true,

  btnName: function() {
    return get(this, 'intl').t('stackPage.admin.header.active_btn');
  }.property(),

  didInsertElement() {
    this.set('newUpTime', this.get('model.vscaling.spec.scale_up_wait_time'));
    this.set('newDownTime', this.get('model.vscaling.spec.scale_down_wait_time'));
  },

  actions: {

    setScaleDownTime(newDownTime) {
      this.set('showScaleDownTimeEditBox', true);
      if (this.validate(newDownTime)) {
        this.set('model.hscaling.spec.scale_down_wait_time', parseInt(newDownTime));
      }
    },

    setScaleUpTime(newUpTime) {
      this.set('showScaleUpTimeEditBox', true);
      if (this.validate(newUpTime)) {
        this.set('model.hscaling.spec.scale_up_wait_time', parseInt(newUpTime));
      }
    },

  },

  validate(scaleData) {
    this.set('flag', true);
    if (isEmpty(scaleData.trim())) {
      this.set('flag', false);
      this.get('notifications').warning(get(this, 'intl').t('launcherPage.scaling.emptyScaling'), {
        autoClear:     true,
        clearDuration: 4200,
        cssClasses:    'notification-warning'
      });
    } else
    if (parseInt(scaleData.trim()) != scaleData.trim()) {
      this.set('flag', false);
      this.get('notifications').warning(get(this, 'intl').t('launcherPage.scaling.invalidFormat'), {
        autoClear:     true,
        clearDuration: 4200,
        cssClasses:    'notification-warning'
      });
    }

    return this.get('flag');
  },

});
