import Mixin from '@ember/object/mixin';
import { cancel } from '@ember/runloop';
import { later } from '@ember/runloop';

export default Mixin.create({
  pollInterval: 2000,

  // growl: Ember.inject.service(),

  pollTimer: null,

  setupController() {
    this._super(...arguments);
    this.scheduleTimer();
  },

  deactivate() {
    this.cancelTimer();
  },

  scheduleTimer() {
    cancel(this.get('pollTimer'));
    this.set('pollTimer', later(() => {
      let controller = this.controller;
      let qp = {};

      (controller.get('queryParams') || []).forEach((param) => {
        qp[param] = controller.get(param);
      });
      this.model(qp).then((model) => {
        this.controller.set('model', model);

        if ( this.get('pollTimer') ) {
          this.scheduleTimer();
        }
      }).catch((err) => {
        console.log(err);
        // this.get('growl').fromError(err);
      });
    }, this.get('pollInterval')));
  },

  cancelTimer() {
    cancel(this.get('pollTimer'));
    // This prevents scheduleTimer from rescheduling if deactivate happened at just the wrong time.
    this.set('pollTimer', null);
  }
});
