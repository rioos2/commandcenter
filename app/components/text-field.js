import TextField from '@ember/component/text-field';// import computed from "ember-computed-decorators";

export default TextField.extend({
  attributeBindings: ['autocorrect', 'autocapitalize', 'autofocus', 'maxLength'],

  /* @computed("placeholderKey")
  placeholder(placeholderKey) {
    return placeholderKey ? I18n.t(placeholderKey) : "";
  }*/
});
