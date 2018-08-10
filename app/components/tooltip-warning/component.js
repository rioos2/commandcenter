import Component from '@ember/component';
import { inject as service } from '@ember/service';
import Tooltip from 'nilavu/mixins/tooltip';
import C from 'nilavu/utils/constants';

export default Component.extend(Tooltip, {
  prefs:      service(),
  classNames: ['tooltip-warning-container'],
  actions:    {
    hideAccessWarning() {
      this.set(`prefs.${ C.PREFS.ACCESS_WARNING }`, false);
      this.destroyTooltip();
    },

  }
});
