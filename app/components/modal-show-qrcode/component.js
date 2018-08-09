import Ember from 'ember';
import ModalBase from 'lacsso/components/modal-base';

export default ModalBase.extend({
  classNames:    ['lacsso', 'modal-container', 'large-modal', 'modal-overlay-width'],
  originalModel: Ember.computed.alias('modalService.modalOpts'),

  name: function() {
    return this.get('originalModel.rioos_sh_kryptonite_qrcode');
  }.property('originalModel.rioos_sh_kryptonite_qrcode'),

  actions: {
    cancel() {
      this.get('modalService').toggleModal();
    },
  },
});
