import ModalBase from 'lacsso/components/modal-base';
import { alias } from '@ember/object/computed';

export default ModalBase.extend({
  classNames:    ['lacsso', 'modal-container', 'large-modal', 'modal-overlay-width'],
  originalModel: alias('modalService.modalOpts'),

  name: function() {
    return this.get('originalModel.key');
  }.property('originalModel.key'),

  actions: {
    cancel() {
      this.get('modalService').toggleModal();
    },
  },
});
