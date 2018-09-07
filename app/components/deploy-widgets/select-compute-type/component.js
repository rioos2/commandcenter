import Component from '@ember/component';
import C from 'nilavu/utils/constants';
import { alias } from '@ember/object/computed';

export default Component.extend({

  showDescription: false,

  compute:       alias('model.stacksfactory.resources.compute_type'),

  isSelectedCPU: function() {
    return this.get('compute') === C.VPS.RESOURSE_COMPUTE_TYPE.CPU;
  }.property('compute'),

  actions: {

    cpuSelected() {
      if (this.get('isSelectedCPU') === false) {
        this.set('isSelectedCPU', true);
        this.set('compute', C.VPS.RESOURSE_COMPUTE_TYPE.CPU);
      }
    },

    gpuSelected() {
      if (this.get('isSelectedCPU') === true) {
        this.set('isSelectedCPU', false);
        this.set('compute', C.VPS.RESOURSE_COMPUTE_TYPE.GPU);
      }
    },

    showDescription() {
      this.set('showInfo', true);
    },

    closeDescription() {
      this.set('showInfo', false);
    }
  }
});
