import Component from '@ember/component';
import { isEmpty } from '@ember/utils';

export default Component.extend({

  tagName: '',

  showMsg: function() {
    return !isEmpty(this.get('msg')) ? false : true;
  }.property('msg'),

});
