import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { get } from '@ember/object';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import C from 'nilavu/utils/constants';


export default Component.extend({
  intl:          service(),
  notifications: service('notification-messages'),

  /* TO-DO: If the below two lines are not used remove them */
  selectedTab:              'cpu',
  panels:                   [],
  /* This section contains boolean flags to toggle the edit boxes
   */
  editMaxReplicas:          true,
  editMinReplicas:          true,
  editScaleDownWaitTime:    true,
  editScaleUpWaitTime:      true,

  spec: alias('model.hscaling.spec'),


  /* This section contains the selections by the user. The state is
   * just inside this component.
   * We start with the defaults.
   */

  minReplicas: computed('spec.min_replicas', function(){
    const m = get(this, 'spec.min_replicas');

    if (isEmpty(m)) {
      return C.HORIZONTAL_SCALE.MIN_REPLICAS;
    }

    return m;
  }),

  maxReplicas: computed('spec.max_replicas', function(){
    const m = get(this, 'spec.max_replicas');

    if (isEmpty(m)) {
      return C.HORIZONTAL_SCALE.MAX_REPLICAS;
    }

    return m;
  }),

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

    setMinReplicas(newMinReplicas) {
      this.set('editMinReplicas', true);
      if (this.validate(newMinReplicas)) {
        this.set('spec.min_replicas', parseInt(newMinReplicas));
      }

    },
    setMaxReplicas(newMaxReplicas) {
      this.set('editMaxReplicas', true);
      if (this.validate(newMaxReplicas)) {
        this.set('spec.max_replicas', parseInt(newMaxReplicas));
      }
    },
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
