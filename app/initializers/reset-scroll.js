import Ember from 'ember';

export function initialize(/* application */) {
  Ember.Route.reopen({
    activate: function() {
        this._super();
        window.scrollTo(0,0);
    }
  });
}

export default {
  name: 'reset-scroll',
  initialize
};
