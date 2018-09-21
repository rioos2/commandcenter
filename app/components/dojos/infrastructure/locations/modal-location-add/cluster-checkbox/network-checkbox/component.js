import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  intl:              service(),
  tagName:           'rio-radio',
  active:            false,
  classNameBindings: ['enable::disabled'],

  actions: {
    sendType() {
      this.toggleProperty('active');
      this.sendAction('updateVirtualNetworkData', this.get('active'), this.get('data.id'));
    },
  }
});
