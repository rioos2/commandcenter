import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';


export default Component.extend({
  tagName:   'section',
  className: '',

  accounts: alias('model.accounts'),

  users: computed('accounts', function() {
    let data = isEmpty(this.get('accounts.content')) ? [] : this.get('accounts.content');

    return data;
  }),

});
