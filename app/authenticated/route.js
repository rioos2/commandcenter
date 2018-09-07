import DefaultHeaders from 'nilavu/mixins/default-headers';
import PromiseToCb from 'nilavu/mixins/promise-to-cb';
import Subscribers from 'nilavu/mixins/subscribers';
import C from 'nilavu/utils/constants';
import { xhrConcur } from 'nilavu/utils/platform';
import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import { Promise } from 'rsvp';
import EmberObject from '@ember/object';
import { cancel } from '@ember/runloop';
const  CHECK_AUTH_TIMER = 60 * 10 * 1000;

export default Route.extend(Subscribers, PromiseToCb, DefaultHeaders, {
  settings:       service(),
  access:         service(),
  language:       service('user-language'),
  storeReset:     service(),
  organization:   service(),

  testTimer: null,

  beforeModel() {

    this._super.apply(this, arguments);

    set(this, 'testTimer', later(() => {
      this.testAuthToken();
    }, CHECK_AUTH_TIMER));

    return this.testAuthToken().then(() => {
      // TO-DO test and enable updation of password
      // if (get(this, 'access.mustChangePassword')) {
      //   this.transitionTo('update-password');
      // }
    });

  },

  model(params, transition) {
    // Save whether the user is admin
    let type = this.get(`session.${ C.SESSION.USER_ROLES }`);
    let isAdmin = (type === C.USER.TYPE_ADMIN) || !this.get('access.enabled');

    this.set('access.admin', isAdmin);
    this.get('session').set(C.SESSION.BACK_TO, undefined);
    let promise = new Promise((resolve, reject) => {
      let tasks = {
        organizations: this.toCb('loadOrganizations'),
        settingsmap:   this.toCb('loadSettings'),
        // //This data will be load on sub infra route.
        // If prometheus or aduit server not connected with api_gateway promise will get 502, and the model will reurn projects [],
        // in particular routes 502 error will be traped then show error msg(ex. aduits, healthz/overall)
        // datacenter: this.toCb('loadHealthz'),
        // stacks:        this.toCb('loadAssemblys'),
        // locations: this.cbFind('datacenter', 'datacenters'),
        // plans: this.cbFind('planfactory', 'plans'),
        // networks: this.cbFind('network', 'networks'),
        // events:        this.toCb('loadAuditEvents'),
      };

      async.auto(tasks, xhrConcur, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    }, 'Load all the things');

    return promise.then((hash) => {
      return EmberObject.create(hash);
    }).catch((err) => {
      return this.loadingError(err, transition, EmberObject.create({
        projects: [],
        project:  null,
      }));
    });
  },

  activate() {

    this._super();
    this.connectSubscribers();
  },

  deactivate() {
    this._super();
    this.disconnectSubscribers();
    cancel(this.get('testTimer'));

    // Forget all the things
    this.get('storeReset').reset();
  },


  actions: {
    // 401: Authentication error, send back to login screen
    error(err, transition) {
      if (err.code === 401) {
        this.send('logout', transition, true);

        return false;
      } else {
        // Bubble up
        return true;
      }
    },

    /*
    TO-DO: Unused.
    The below code is to operate in an organization boundry
     When we switch an organization, unsubcribe and load the new
     organization details
     */
    switchOrigin(origin, team = {}, transition = true) {
      this.get('organization').orgnizationChanged(origin, team);
      this.disconnectSubscribers(() => {
        this.send('finishSwitchOrigin', origin, transition);
      });
    },

    finishSwitchOrigin(origin, transition) {
      this.get('storeReset').reset();
      if (transition) {
        this.intermediateTransitionTo('authenticated');
      }
      // this.set(`tab-session.${ C.TABSESSION.PROJECT }`, origin);
      this.refresh();
    },
  },

  testAuthToken() {
    return get(this, 'access').testAuth()
      .catch(() => {
        this.transitionTo('login');
        this.send('logout', null);
      });
  },

  loadingError(err, transition, ret) {
    let isAuthEnabled = this.get('access.enabled');

    if (err && ((isAuthEnabled && !this.isAPIServerFlunked(err.code)) || this.deniedAuthorizationOrAuthentication(err.code))) {
      this.set('access.enabled', true);

      this.send('logout', transition, (transition.targetName !== 'authenticated.index'));

      return;
    }
    this.replaceWith(transition.targetName);

    return ret;
  },

  /*
   401: Authentication error
   403: Authorization error
   */
  deniedAuthorizationOrAuthentication(code) {
    return C.UNAUTHENTICATED_HTTP_CODES.includes(code) || C.UNAUTHORIZED_HTTP_CODES.includes(code);
  },


  /*
   * 500 - Internal server error (Some of the systems connected to api aren't working)
   * 502 - Badgateway: We get this error when
   */
  isAPIServerFlunked(code) {
    return (C.BADGATEWAY_HTTP_CODES.includes(code) || C.INTERNALSERVER_HTTP_CODES.includes(code));
    /* This code doesn't make sense, this sends
    false or
    undefined.
    Both are same.
    Should we do something like this to trap true/false
    return ["500", "502"].includes(err.code);
    */
  },

  cbFind(type, store = 'store', opt = null) {
    return (results, cb) => {
      if (typeof results === 'function') {
        cb = results;
        results = null;
      }

      return this.get(store).find(type, null, opt).then((res) => {
        cb(null, res);
      }).catch((err) => {
        cb(err, null);
      });
    };
  },

  // Fetch all organization that belongs to the user.
  loadOrganizations() {
    this.get('organization').selectOrigin();

    return this.get('store').find('origin', null, this.opts(`origins/accounts/${ this.get('session').get('id') }`));
  },
  // Every Rio/OS site will have common settings stored under an url  'cluster_info' in system origin named 'rioos_system'.
  // This methods load that setting. Setting is a set of known key value pairs.
  loadSettings() {
    return this.get('userStore').find('settingsmap', null, this.opts('settingsmap/cluster_info/origins/rioos_system'));
  },

  // Load the datacenters overall healthz (cpu, memory, disk), node statistics, os usages
  loadHealthz() {
    return this.get('store').find('reportsstatistics', null, this.opts('healthz/overall'));
  },

  /* Stacks launched by a customer are stored in an elementary level as Assemblys.
       StacksFactory
                 |
  |--------------------------------|
  AssemblyFactory             AssemblyFactory
          |                          |
  |-------------|           |-----------------|
  Assembly  Assembly
  */
  loadAssemblys() {
    return this.get('store').find('assembly', null, this.opts('machines'));
  },

  loadSecrets() {
    return this.get('store').find('secret', null, this.opts('secrets'));
  },

  loadAuditEvents() {
    return this.get('store').find('event', null, this.opts('audits'));
  },

});
