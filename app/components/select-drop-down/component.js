import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import $ from 'jquery';

export default Component.extend({

  tagName:     '',
  className:   '',

  didInsertElement() {
    if (!isEmpty(this.get('initValue'))) {
      $("[name='select-drop-down-com']").val(this.get('initValue'));
    } else {
      $("[name='select-drop-down-com']").val(this.get('placeholder'));
    }
  },

  actions: {
    selectOption(option) {
      this.set('selectedOption', option);
      this.sendAction('callBackAction', option);
    },
  },

});
