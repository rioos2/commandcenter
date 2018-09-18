import Component from '@ember/component';
import C from 'nilavu/utils/constants';
import { alias } from '@ember/object/computed';
import {
  get, set, computed
} from '@ember/object';

export default Component.extend({

  showDescription: false,

  compute:       alias('stacksfactory.resources.compute_type'),

  isSelectedCPU: computed('compute', function() {
    return get(this, 'compute') === C.VPS.RESOURSE_COMPUTE_TYPE.CPU;
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
