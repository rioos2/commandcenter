import Ember from 'ember';
import C from 'nilavu/utils/constants';
import D from 'nilavu/utils/default';
import { denormalizeName } from 'nilavu/utils/denormalize';

export default Ember.Component.extend({
  tagName: '',

  validateSecret: function () {
    return this.get('model.settings')[denormalizeName(`${C.SETTING.SECRET_TYPE}`)] || D.VPS.secret;
 },

  selectionChecker: function() {
    var check = this.get("secretType") == this.get("key");
    if (check) {
      this.set("active", true);
    } else {
      this.set("active", false);
    }
  }.observes('activate'),

  actions: {
    sendType() {
      this.sendAction('getSecretType', this.get('key'));
    },
  }
});
