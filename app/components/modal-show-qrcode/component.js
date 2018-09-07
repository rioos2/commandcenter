import ModalBase from 'lacsso/components/modal-base';
import { alias } from '@ember/object/computed';
import { htmlSafe } from '@ember/string';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { get } from '@ember/object';



export default ModalBase.extend({
  intl:          service(),


  classNames:    ['lacsso', 'modal-container', 'large-modal', 'modal-overlay-width'],
  originalModel: alias('modalService.modalOpts'),

  note: computed('originalModel.key', function() {
    return htmlSafe(get(this, 'intl').t('QRCode.qrNote'));
  }),

  actions: {
    cancel() {
      this.get('modalService').toggleModal();
    },
  },
});
