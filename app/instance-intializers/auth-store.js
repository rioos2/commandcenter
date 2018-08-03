/* The plan was to sperate auth end point which can be scaled and developed separately.
Right now authencation bundled with api-gateway. So this remains unuse right now*/
export function initialize(instance) {
  var application = instance.lookup('application:main');
  var store = instance.lookup('service:auth-store');

  store.reopen({
    removeAfterDelete: false,
    baseUrl:           application.apiEndpoint,
    skipTypeifyKeys:   ['labels'],
  });
}

export default {
  name:  'auth-store',
  initialize,
  after: 'store',
};
