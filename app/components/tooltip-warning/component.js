import Ember from 'ember';
import Tooltip from 'nilavu/mixins/tooltip';
import C from 'nilavu/utils/constants';

export default Ember.Component.extend(Tooltip, {
  prefs:      Ember.inject.service(),
  classNames: ['tooltip-warning-container'],
  actions:    {
    hideAccessWarning() {
      this.set(`prefs.${ C.PREFS.ACCESS_WARNING }`, false);
      this.destroyTooltip();
    },

  }
});
