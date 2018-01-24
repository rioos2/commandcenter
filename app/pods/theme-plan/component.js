import Ember from 'ember';
import Config from 'nilavu/mixins/config';
import C from 'nilavu/utils/constants';
export function denormalizeName(str) {
  return str.replace(new RegExp('['+C.SETTING.DOT_CHAR+']','g'),'.').toLowerCase();
}
export default Ember.Component.extend(Config,{

  tagName: '',
  active: '',

  initializeChart: Ember.on('didInsertElement', function() {

    if (this.validateOsName() == this.get('vm.type')) {
      this.sendAction('refreshAfterAction', this.get('vm'));
      this.set("active", "active");
    }
  }),

  validateOsName: function () {
    alert("os");
    alert("os"+this.get('model.settings')[denormalizeName(`${C.SETTING.OS_NAME}`)]);
    return this.get('model.settings')[denormalizeName(`${C.SETTING.OS_NAME}`)] || this.defaultVPS().destro;
 },

  selectionChecker: function() {
    var check = this.get("model.assemblyfactory.current_os_tab") == this.get("vm.type");
    if (check) {
      this.set("active", "active");
    } else {
      this.set("active", "");
    }
  }.observes('activate'),

  actions: {
    selected() {
      this.sendAction('refreshAfterAction', this.get('vm'));
    },
  }

});
