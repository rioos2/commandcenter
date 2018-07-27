// Inject the contents of ENV.APP in config/environment.js  into all the things as an 'app' property

export function initialize(application) {
  application.inject('controller', 'app', 'application:main');
  application.inject('route', 'app', 'application:main');
  application.inject('view', 'app', 'application:main');
  application.inject('component', 'app', 'application:main');
  application.inject('service', 'app', 'application:main');
  application.inject('model', 'app', 'application:main');
}

export default {
  name:       'app',
  initialize
};
