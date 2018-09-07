import ModalBase from 'lacsso/components/modal-base';
import { alias } from '@ember/object/computed';

export default ModalBase.extend({
  classNames:    ['lacsso', 'modal-container', 'large-modal', 'modal-overlay-width'],
  originalModel: alias('modalService.modalOpts'),

  actions: {
    cancel() {
      this.get('modalService').toggleModal();
    },

    revokeAdmin() {
      const actionType = 'revokeAdmin';

      this.get('originalModel').updateAccount({
        suspend:  this.get('originalModel').get('suspend'),
        is_admin: false,
        approval: this.get('originalModel').get('approval')
      }, actionType
      );
    }
  },
});
