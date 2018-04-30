import Ember from 'ember';
import C from 'nilavu/utils/constants';
import D from 'nilavu/utils/default';
import { denormalizeName } from 'nilavu/utils/denormalize';

export default Ember.Component.extend({

  tagName: '',
  active: 'item-os',

  initializeChart: Ember.on('didInsertElement', function() {    
    Ember.run.once('afterRender', this, this.imageData);
    if (this.validateOsName() == this.get('vm.type')) {
      this.sendAction('refreshAfterAction', this.get('vm'));
      this.set("active", "item-os selected");
    }
  }),

  icon: function() {   
    return this.get('vm.icon');
  }.property('vm'),

  validateOsName: function () {
    return this.get('model.settings')[denormalizeName(`${C.SETTING.OS_NAME}`)] || D.VPS.destro;
 },

  selectionChecker: function() {
    var check = this.get("model.assemblyfactory.current_os_tab") == this.get("vm.type");
    if (check) {
      this.set("active", "item-os selected");
    } else {
      this.set("active", "item-os");
    }
  }.observes('activate'),

  actions: {
    selected() {
      this.sendAction('refreshAfterAction', this.get('vm'));
    },
  }

});
