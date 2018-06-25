
export function initialize(instance) {
  var application = instance.lookup('application:main');
  var store = instance.lookup('service:user-store');
  var cookies = instance.lookup('service:cookies');

  store.reopen();
  store.baseUrl = application.apiEndpoint;

  let timeout = cookies.get('timeout');
  if ( timeout ) {
    store.defaultTimeout = timeout;
  }
}

export default {
  name: 'user-store',
  initialize: initialize,
  after: 'store',
};
