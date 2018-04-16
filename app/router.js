import Ember from 'ember';
import config from './config/environment';
import { applyRoutes, clearRoutes } from 'nilavu/utils/additional-routes';

const Router = Ember.Router.extend({
  location: config.locationType
});


Router.map(function () {
  this.route('ie');
  this.route('index');
  this.route('failWhale', { path: '/fail' });
  this.route('not-found', { path: '*path' });

  this.route('login', function () {
    this.route('index', { path: '/' });
  });

  this.route('signup', function () {
    this.route('index', { path: '/' });
  });

  this.route('logout');

  this.route('authenticated', { path: '/' }, function () {
    ////
    this.route('project', { path: '/env' }, function () {
      this.route('index', { path: '/' });

      // Infrastructure
      this.route('infrastructure-tab', { path: '/infra', resetNamespace: true }, function () {
        //quick glimpse of the datacenter (consumption, usage)
        this.route('index', { path: '/' });

        this.route('data-center', { path: '/datacenter' });

        //manage the secrets of the account
        this.route('secrets', { path: '/secrets'}, function () {
          this.route('download', { path: '/:id' });
        });
      });

      //this.route('help');
    });

    // Applications (digital cloud, containers, blockchain)
    this.route('applications-tab', { path: '/apps', resetNamespace: true }, function () {
      //Route to manage application based on orchestrator.
      //The default orchestrator is Rio/OS Beedi
      this.route('index', { path: '/' });

      // Applications (digital cloud, containers, blockchain)
      this.route('stacks', { path: '/stacks', resetNamespace: true }, function () {
        this.route('index', { path: '/' });
        this.route('createcloud', { path: '/createcloud' });
        this.route('createdocker', { path: '/createdocker' });

        // A single application (digital cloud, containers, blockchain)
        // Allows console based on the type of application
        this.route('stack', { path: '/stack', resetNamespace: true }, function () {
          this.route('console', { path: '/console' });
          this.route('container-console', { path: '/containerconsole' });
        });
      });
    });

    this.route('accounts', { resetNamespace: true }, function () {
      this.route('index', { path: '/' });
      this.route('info', { path: '/info' });
    });

    // End: Authenticated
  });


  // Load any custom routes from additional-routes
  var cb = applyRoutes("application");
  if (cb) {
    cb.apply(this);
  }
  clearRoutes();
});


export default Router;
