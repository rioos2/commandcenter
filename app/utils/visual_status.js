import { isEmpty } from '@ember/utils';
import EmberObject from '@ember/object';
import { get } from '@ember/object';
import C from 'nilavu/utils/constants';
// HealthGauges: The builtin dashboard
// An object that has ability to display all the gauges in the format needed.
export default  EmberObject.extend({

  _check(status, allowed) {

    const hasHealth  = !isEmpty(status);

    if (hasHealth) {
      for (const key of Object.keys(allowed)) {
        const d = allowed[key].includes(status.toLowerCase());

        if (d) {
          return key;
        }
      }
    }
  },

  attr() {
    const health = get(this, 'health');

    return  this._check(health, C.HEALTHZ_STATE.ATTRS);

  },

  expanded() {
    const health = get(this, 'health');

    return  this._check(health, C.HEALTHZ_STATE.STATUS);
  },

  tooltip() {
    const health = get(this, 'health');

    return  this._check(health, C.HEALTHZ_STATE.TOOLTIP);
  },

});
