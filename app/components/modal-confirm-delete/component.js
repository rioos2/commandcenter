import ModalBase from 'lacsso/components/modal-base';
import { alias } from '@ember/object/computed';


export default ModalBase.extend({
  classNames:    ['lacsso', 'modal-container', 'large-modal', 'modal-overlay-width'],
  originalModel: alias('modalService.modalOpts'),

  name: function() {
    return this.get('originalModel').get('name');
  }.property('originalModel.name'),

  actions: {
    cancel() {
      this.get('modalService').toggleModal();
    },

    deleteAsm() {
      this.get('originalModel').send('delete');
    }
  },
});
