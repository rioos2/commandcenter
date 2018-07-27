// Injects all  Ember controller with the notifications, and notification-messsages service.
export function initialize(application) {
  application.inject('controller', 'notifications', 'service:notification-messages');
}

export default {
  name: 'inject-notifications',
  initialize
};
