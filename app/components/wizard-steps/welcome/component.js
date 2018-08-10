import { get } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  intl: service(),

  tagName:   'section',
  className: '',

  didInsertElement() {
    this.set('welcomeMsg', htmlSafe(get(this, 'intl').t('wizard.welcomeMessage')));
  },

  actions: {
    nextStep() {
      this.sendAction('nextStep', this.get('category'));
    },
  },
});
