export function initialize(instance) {
  var application = instance.lookup('application:main');
  var store = instance.lookup('service:auth-store');
  store.reopen();
  store.reopen({
    removeAfterDelete: false,
    baseUrl: application.apiEndpoint,
    skipTypeifyKeys: ['labels'],
  });
}

export default {
  name: 'auth-store',
  initialize: initialize,
  after: 'store',
};
