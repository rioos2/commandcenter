import Component from '@ember/component';

import C from 'nilavu/utils/constants';
import D from 'nilavu/utils/default';
import { denormalizeName } from 'nilavu/utils/denormalize';
import {
  get, set, observer
} from '@ember/object';

export default Component.extend({
  tagName: '',
  enable:  '',

  selectionChecker: observer('activate', function() {
    var check = get(this, 'secretType') === get(this, 'key');

    if (check) {
      set(this, 'active', true);
    } else {
      set(this, 'active', false);
    }
  }),

  didInsertElement() {

    if (get(this, 'key') === this.validateSecret()) {
      this.send('sendType');
    }

    if (D.VPS.disableSecretTypes.includes(get(this, 'key'))) {
      set(this, 'enable', 'disable');
    }
  },

  actions: {
    sendType() {
      this.sendAction('getSecretType', get(this, 'key'));
    },
  },
  validateSecret() {
    return get(this, 'settings')[denormalizeName(`${ C.SETTING.SECRET_TYPE }`)] || D.VPS.defaultSecret;
  },

});
