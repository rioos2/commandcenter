import Component from '@ember/component';
import C from 'nilavu/utils/constants';
import {  alias} from '@ember/object/computed';
import {  get,set,  computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default Component.extend({

  showDescription: false,
  labels: alias('stacksfactory.object_meta.labels'),
  compute: alias('stacksfactory.resources.compute_type'),



  isSelectedCPU: computed('compute', function() {
    return get(this, 'compute') === C.VPS.RESOURSE_COMPUTE_TYPE.CPU;
  }),

  title: computed('labels', function() {
    let c = get(this, 'labels.rioos_category');
    if (isEmpty(c)) {
      c = C.CATEGORIES.MACHINE;
    }
    const ci = `launcherPage.${ c }.title`;
    return ci;
  }),

  actions: {

    cpuSelected() {
      if (get(this, 'isSelectedCPU') === false) {
        set(this, 'isSelectedCPU', true);
        set(this, 'compute', C.VPS.RESOURSE_COMPUTE_TYPE.CPU);
      }
    },

    gpuSelected() {
      if (get(this, 'isSelectedCPU') === true) {
        set(this, 'isSelectedCPU', false);
        set(this, 'compute', C.VPS.RESOURSE_COMPUTE_TYPE.GPU);
      }
    },

    showDescription() {
      set(this, 'showInfo', true);
    },

    closeDescription() {
      set(this, 'showInfo', false);
    }

  }
});
