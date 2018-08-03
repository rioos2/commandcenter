export function initialize(application) {
  // Shortcuts for debugging.  These should never be used in code.
  window.l = function(name) {
    return application.__container__.lookup(name);
  };

  window.lc = function(name) {
    return application.__container__.lookup(`controller:${  name }`);
  };

  window.s = application.__container__.lookup('service:store');
  window.us = application.__container__.lookup('service:user-store');
}

export default {
  name:       'lookup',
  initialize,
  after:      'user-store',
};
