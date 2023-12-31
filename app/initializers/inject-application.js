// Injects all Ember components & models (for actions) with the application controler, for modals
export function initialize(application) {
  application.inject('component', 'application', 'controller:application');
  application.inject('model', 'application', 'controller:application');
}

export default {
  name:       'inject-application',
  initialize
};
