import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import {
  get, set, observer
} from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';


export default Component.extend({

  notifications:     service('notification-messages'),

  error:        null,
  triggerError: observer('error', function() {
    if (!isEmpty(get(this, 'error'))) {
      get(this, 'notifications').warning(htmlSafe(get(this, 'error')), {
        autoClear:     true,
        clearDuration: 6000,
        cssClasses:    'notification-warning'
      });
    }
    set(this, 'error', '');
  }),

});
