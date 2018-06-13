import Component from '@ember/component';
import C from 'nilavu/utils/constants';

export default Component.extend({

    compute: Ember.computed.alias('model.stacksfactory.resources.compute_type'),
    showInfo: false,

    isSelectedCPU: function() {
      return this.get('compute') === C.VPS.RESOURSE_COMPUTE_TYPE.CPU;
    }.property('compute'),

    actions: {

        clickCPU: function() {
            if (this.get('isSelectedCPU') == false) {
              this.set('isSelectedCPU', true);
              this.set('compute', C.VPS.RESOURSE_COMPUTE_TYPE.CPU);
            }
        },

        clickGPU: function() {
            if (this.get('isSelectedCPU') == true) {
              this.set('isSelectedCPU', false);
              this.set('compute', C.VPS.RESOURSE_COMPUTE_TYPE.GPU);
            }
        },

        clickInfo: function() {
            this.set('showInfo', true);
        },

        clickClose: function() {
            this.set('showInfo', false);
        }
    }
});
