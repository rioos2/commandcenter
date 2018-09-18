import Component from '@ember/component';
import C from 'nilavu/utils/constants';
import D from 'nilavu/utils/default';
import { denormalizeName } from 'nilavu/utils/denormalize';
import { on } from '@ember/object/evented';
import {
  get, set, computed, observer
} from '@ember/object';

export default Component.extend({

  tagName: '',
  active:  'item-os',

  initializeChart: on('didInsertElement', function() {
    // Ember.run.once('afterRender', this, this.imageData);
    if (this.validateOsName() === get(this, 'vm.type')) {
      this.sendAction('refreshAfterAction', get(this, 'vm'));
      set(this, 'active', 'item-os selected');
    }
  }),

  icon: computed('vm.icon', function() {
    return get(this, 'vm.icon');
  }),

  selectionChecker: observer('activate', function() {
    var check = get(this, 'stacksfactory.current_os_tab') === get(this, 'vm.type');

    if (check) {
      set(this, 'active', 'item-os selected');
    } else {
      set(this, 'active', 'item-os');
    }
  }),

  actions: {
    selected() {
      this.sendAction('refreshAfterAction', get(this, 'vm'));
    },
  },

  validateOsName() {
    return get(this, 'settings')[denormalizeName(`${ C.SETTING.OS_NAME }`)] || D.VPS.destro;
  },

});
