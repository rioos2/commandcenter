import Ember from 'ember';
//import computed from "ember-computed-decorators";

export default Ember.TextField.extend({
  attributeBindings: ['autocorrect', 'autocapitalize', 'autofocus', 'maxLength'],

  /*@computed("placeholderKey")
  placeholder(placeholderKey) {
    return placeholderKey ? I18n.t(placeholderKey) : "";
  }*/
});
