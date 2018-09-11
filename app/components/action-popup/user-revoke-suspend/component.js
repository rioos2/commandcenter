import ModalBase from 'lacsso/components/modal-base';
import { alias } from '@ember/object/computed';

export default ModalBase.extend({
  classNames:    ['lacsso', 'modal-container', 'large-modal', 'modal-overlay-width'],
  originalModel: alias('modalService.modalOpts'),

  actions: {
    cancel() {
      this.get('modalService').toggleModal();
    },

    revokeSuspend() {
      const actionType = 'revokeSuspend';

      this.get('originalModel').updateAccount({
        suspend:  false,
        is_admin: this.get('originalModel').get('is_admin'),
        approval: this.get('originalModel').get('approval')
      }, actionType
      );
    }
  },
});
