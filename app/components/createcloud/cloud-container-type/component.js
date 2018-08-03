import Component from '@ember/component';
import C from 'nilavu/utils/constants';

export default Component.extend({

  showInfo: false,

  compute:       Ember.computed.alias('model.stacksfactory.resources.compute_type'),
  isSelectedCPU: function() {
    return this.get('compute') === C.VPS.RESOURSE_COMPUTE_TYPE.CPU;
  }.property('compute'),

  actions: {

    clickCPU() {
      if (this.get('isSelectedCPU') == false) {
        this.set('isSelectedCPU', true);
        this.set('compute', C.VPS.RESOURSE_COMPUTE_TYPE.CPU);
      }
    },

    clickGPU() {
      if (this.get('isSelectedCPU') == true) {
        this.set('isSelectedCPU', false);
        this.set('compute', C.VPS.RESOURSE_COMPUTE_TYPE.GPU);
      }
    },

    clickInfo() {
      this.set('showInfo', true);
    },

    clickClose() {
      this.set('showInfo', false);
    }
  }
});
