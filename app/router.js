import Ember from 'ember';
import config from './config/environment';
import {
  applyRoutes,
  clearRoutes
} from 'nilavu/utils/additional-routes';

const Router = Ember.Router.extend({
  location: config.locationType
});


Router.map(function() {
  this.route('index');
  this.route('failWhale', { path: '/fail' });
  this.route('not-found', { path: '*path' });

  this.route('login');
  this.route('signup');
  this.route('logout');
  this.route('vnc', { path: '/vnc' });

  this.route('authenticated', { path: '/' }, function() {
    this.route('home', { resetNamespace: true });
    this.route('home', { resetNamespace: true });
    this.route('launcher', { resetNamespace: true });
    this.route('manage', { resetNamespace: true });

    /*this.route('dropdowns', {
      resetNamespace: true
    }, function() {
      this.route('dropdown-1');
      this.route('dropdown-2');
      this.route('dropdown-3');
    });*/

  });

  // Load any custom routes from additional-routes
  var cb = applyRoutes("application");
  if (cb) {
    cb.apply(this);
  }
  clearRoutes();
});


export default Router;
