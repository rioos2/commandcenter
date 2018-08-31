import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import C from 'nilavu/utils/constants';


export default Component.extend({
  intl:          service(),
  notifications: service('notification-messages'),

  selectedTab:              'cpu',
  panels:                   [],
  editScaleUpWaitTime:   true,
  editScaleDownWaitTime: true,
  spec:                  alias('model.vscaling.spec'),

  upWaitTime: computed('spec.scale_up_wait_time', function(){
    const m = get(this, 'spec.scale_up_wait_time');

    if (isEmpty(m)) {
      return C.HORIZONTAL_SCALE.SCALEUP_WAITTIME;
    }

    return m;
  }),

  downWaitTime: computed('spec.scale_down_wait_time', function(){
    const m = get(this, 'spec.scale_down_wait_time');

    if (isEmpty(m)) {
      return C.HORIZONTAL_SCALE.SCALEDOWN_WAIT_TIME;
    }

    return m;
  }),


  actions: {

    setScaleDownTime(newDownTime) {
      this.set('editScaleDownWaitTime', true);
      if (this.validate(newDownTime)) {
        this.set('spec.scale_down_wait_time', parseInt(newDownTime));
      }
    },

    setScaleUpTime(newUpTime) {
      this.set('editScaleUpWaitTime', true);
      if (this.validate(newUpTime)) {
        this.set('spec.scale_up_wait_time', parseInt(newUpTime));
      }
    },

  },

  validate(scaleProp) {
    const v = isEmpty(scaleProp.trim());

    const p =  parseInt(scaleProp.trim()) != scaleProp.trim() // eslint-disable-line

    let message = '';

    if (v) {
      message = get(this, 'intl').t('launcherPage.scaling.emptyScaling');
    }

    // Hmm - causes  a newline, if v is false. FIX it up later
    if (p) {
      message = `/n ${ get(this, 'intl').t('launcherPage.scaling.emptyScaling') }`;
    }

    const hasMessage = message.trim().length <= 0;

    if (!hasMessage) {
      this.get('notifications').warning(get(this, 'intl').t('launcherPage.scaling.emptyScaling'), {
        autoClear:     true,
        clearDuration: 4200,
        cssClasses:    'notification-warning'
      });
    }

    return hasMessage;

  },


});
