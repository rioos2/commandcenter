import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  intl:       service(),
  classNames: ['chart-os'],

  didInsertElement() {
    let d = document.getElementById(`empty-message-${ this.get('type') }`);

    d.insertAdjacentHTML('afterend', get(this, 'intl').t(`dashboard.emptyNode.${ this.get('type') }`));
  },
});
