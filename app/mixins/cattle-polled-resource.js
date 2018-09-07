import Util from 'nilavu/utils/util';
import C from 'nilavu/utils/constants';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  reservedKeys: ['delayTimer', 'pollTimer'],

  replaceWith() {
    this._super.apply(this, arguments);
    this.transitioningChanged();
  },

  // ember-api-store hook
  wasAdded() {
    this.transitioningChanged();
  },

  // ember-api-store hook
  wasRemoved() {
    this.transitioningChanged();
  },

  delayTimer: null,
  clearDelay() {
    clearTimeout(this.get('delayTimer'));
    this.set('delayTimer', null);
  },

  pollTimer: null,
  clearPoll() {
    clearTimeout(this.get('pollTimer'));
    this.set('pollTimer', null);
  },

  needsPolling: function() {
    return ( this.get('transitioning') === 'yes' ) ||
           ( this.get('state') === 'requested' );
  }.property('transitioning', 'state'),

  remove() {
    return this._super().finally(() => {
      this.reload();
    });
  },

  transitioningChanged: function() {
    var delay = this.constructor.pollTransitioningDelay;
    var interval = this.constructor.pollTransitioningInterval;

    // This resource doesn't want polling
    if ( !delay || !interval ) {
      return;
    }

    // This resource isn't transitioning or isn't in the store
    if ( !this.get('needsPolling') || !this.isInStore() ) {
      this.clearPoll();
      this.clearDelay();

      return;
    }

    // We're already polling or waiting, just let that one finish
    if ( this.get('delayTimer') ) {
      return;
    }

    this.set('delayTimer', setTimeout(() => {
      this.transitioningPoll();
    }, Util.timerFuzz(delay)));
  }.observes('transitioning'),

  reloadOpts: function() {
    return null;
  }.property(),

  transitioningPoll() {
    this.clearPoll();

    if ( !this.get('needsPolling') || !this.isInStore() ) {
      return;
    }

    // console.log('Polling', this.toString());
    this.reload(this.get('reloadOpts')).then(() => {
      // console.log('Poll Finished', this.toString());
      if ( this.get('needsPolling') ) {
        let interval = this.constructor.pollTransitioningInterval;
        let factor = this.constructor.pollTransitioningIntervalFactor;

        if ( factor ) {
          interval *= factor;
        }

        let max = this.constructor.pollTransitioningIntervalMax;

        if ( max ) {
          interval = Math.min(max, interval);
        }

        // console.log('Rescheduling', this.toString());
        this.set('pollTimer', setTimeout(() => {
          // console.log('2 expired', this.toString());
          this.transitioningPoll();
        }, Util.timerFuzz(interval)));
      } else {
        // If not transitioning anymore, stop polling
        this.clearPoll();
        this.clearDelay();
      }
    }).catch(() => {
      // If reloading fails, stop polling
      this.clearPoll();
      // but leave delay set so that it doesn't restart, (don't clearDelay())
    });
  },

  stateChanged: function() {
    // Get rid of things that are removed
    if ( C.MANAGEMENT.STATUS.TERMINATE.includes(this.state) ) {
      try {
        this.clearPoll();
        this.clearDelay();
        this.get('store')._remove(this.get('type'), this);
      } catch (e) {
      }
    }
  }.observes('state'),
});
