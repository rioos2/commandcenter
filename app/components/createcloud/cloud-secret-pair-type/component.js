import Ember from 'ember';
import C from 'nilavu/utils/constants';
import D from 'nilavu/utils/default';
import { denormalizeName } from 'nilavu/utils/denormalize';

export default Ember.Component.extend({
  tagName: '',
  enable: '',

  didInsertElement() {
    if(this.get("key") == this.validateSecret()){
      this.send('sendType');
    }
    if(D.VPS.disableSecretTypes.includes(this.get('key'))) {
      this.set('enable', 'disable');
    }
  },

  validateSecret: function () {
    return this.get('model.settings')[denormalizeName(`${C.SETTING.SECRET_TYPE}`)] || D.VPS.defaultSecret;
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
