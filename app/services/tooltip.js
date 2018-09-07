import Service from '@ember/service';
import { later, cancel } from '@ember/runloop';
const DELAY = 250;

export default Service.extend({
  mouseLeaveTimer:       null,
  requireClick:          false,
  tooltipOpts:           null,
  openedViaContextClick: false,

  startTimer() {
    this.set('mouseLeaveTimer', later(() => {
      this.hide();
    }, DELAY));
  },

  cancelTimer() {
    cancel(this.get('mouseLeaveTimer'));
  },

  hide() {
    this.set('tooltipOpts', null);
  },

  leave() {
    if (!this.get('requireClick')) {
      this.startTimer();
    }
  },
});
