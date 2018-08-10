import Route from '@ember/routing/route';

// When transation to a new route scroll to the page top
export function initialize(/* application */) {
  Route.reopen({
    activate() {
      this._super();
      window.scrollTo(0, 0);
    }
  });
}

export default {
  name: 'reset-scroll',
  initialize
};
