import Component from '@ember/component';
import C from 'nilavu/utils/constants';
import D from 'nilavu/utils/default';
import { denormalizeName } from 'nilavu/utils/denormalize';
import { on } from '@ember/object/evented';

export default Component.extend({

  tagName: '',
  active:  'item-os',

  initializeChart: on('didInsertElement', function() {
    // Ember.run.once('afterRender', this, this.imageData);
    if (this.validateOsName() === this.get('vm.type')) {
      this.sendAction('refreshAfterAction', this.get('vm'));
      this.set('active', 'item-os selected');
    }
  }),

  icon: function() {
    return this.get('vm.icon');
  }.property('vm'),

  selectionChecker: function() {
    var check = this.get('model.stacksfactory.current_os_tab') === this.get('vm.type');

    if (check) {
      this.set('active', 'item-os selected');
    } else {
      this.set('active', 'item-os');
    }
  }.observes('activate'),

  actions: {
    selected() {
      this.sendAction('refreshAfterAction', this.get('vm'));
    },
  },

  validateOsName() {
    return this.get('model.settings')[denormalizeName(`${ C.SETTING.OS_NAME }`)] || D.VPS.destro;
  },

});
