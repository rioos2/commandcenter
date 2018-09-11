import ModalBase from 'lacsso/components/modal-base';
import { alias } from '@ember/object/computed';

export default ModalBase.extend({
  classNames:    ['lacsso', 'modal-container', 'large-modal', 'modal-overlay-width'],
  originalModel: alias('modalService.modalOpts'),

  actions: {
    cancel() {
      this.get('modalService').toggleModal();
    },

    makeAsAdmin() {
      const actionType = 'admin';

      this.get('originalModel').updateAccount({
        suspend:  this.get('originalModel').get('suspend'),
        is_admin: true,
        approval: this.get('originalModel').get('approval')
      }, actionType
      );
    }
  },
});
