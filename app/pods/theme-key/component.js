import Ember from 'ember';
import Config from 'nilavu/mixins/config';
import C from 'nilavu/utils/constants';
export function denormalizeName(str) {
  return str.replace(new RegExp('['+C.SETTING.DOT_CHAR+']','g'),'.').toLowerCase();
}
export default Ember.Component.extend(Config,{

  tagName: '',

  initializeChart: Ember.on('didInsertElement', function() {

    if (this.validateSecret() == this.get('key')) {
      this.sendAction('getSecretType', this.get('key'));
      this.set("active", "selected");
    }
  }),

  validateSecret: function () {
    return this.get('model.settings')[denormalizeName(`${C.SETTING.SECRET_TYPE}`)] || this.defaultVPS().secret;
 },

  selectionChecker: function() {
    var check = this.get("secretType") == this.get("key");
    if (check) {
      this.set("active", "selected");
    } else {
      this.set("active", "");
    }
  }.observes('activate'),

  actions: {
    sendType() {
      this.sendAction('getSecretType', this.get('key'));
    },
  }
});
