import Ember from 'ember';
import C from 'nilavu/utils/constants';
import Subscribers from 'nilavu/mixins/subscribers';
import {
  xhrConcur
} from 'nilavu/utils/platform';
import PromiseToCb from 'nilavu/mixins/promise-to-cb';
import DefaultHeaders from 'nilavu/mixins/default-headers';


const CHECK_AUTH_TIMER = 60 * 10 * 1000;

export default Ember.Route.extend(Subscribers, PromiseToCb, DefaultHeaders, {
  settings: Ember.inject.service(),
  access: Ember.inject.service(),
  language: Ember.inject.service('user-language'),
  storeReset: Ember.inject.service(),

  testTimer: null,

  beforeModel(transition) {
    this._super.apply(this, arguments);

    // Load application is desktop or web
    // If it is desktop application, then add the proxy server url
    // otherwise ember manage it.
    this.get('storeReset').set();
    if (this.get('access.enabled')) {
      if (!this.get('access').isLoggedIn()) {
        transition.send('logout', transition, false);
        return Ember.RSVP.reject('Not logged in');
      }
    }
  },

  model(params, transition) {
    // Save whether the user is admin
    let type = this.get(`session.${C.SESSION.USER_TYPE}`);
    let isAdmin = (type === C.USER.TYPE_ADMIN) || !this.get('access.enabled');
    this.set('access.admin', isAdmin);
    this.get('session').set(C.SESSION.BACK_TO, undefined);
    let promise = new Ember.RSVP.Promise((resolve, reject) => {
      let tasks = {
        settingsmap: this.toCb('loadSettings'),
        datacenter: this.toCb('loadDataCenter'),
        stacks: this.toCb('loadStacks'),
        events: this.toCb('loadEvents'),
      };

      async.auto(tasks, xhrConcur, function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    }, 'Load all the things');

    return promise.then((hash) => {
      return Ember.Object.create(hash);
    }).catch((err) => {
      return this.loadingError(err, transition, Ember.Object.create({
        projects: [],
        project: null,
      }));
    });
  },

  activate() {
    let app = this.controllerFor('application');
    this._super();
    this.connectSubscribers();
  },

  deactivate() {
    this._super();
    this.disconnectSubscribers();
    Ember.run.cancel(this.get('testTimer'));

    // Forget all the things
    this.get('storeReset').reset();
  },

  loadingError(err, transition, ret) {
    let isAuthEnabled = this.get('access.enabled');
    if (err && ((isAuthEnabled && this.decideCode(err.code)) || ["401", "403"].includes(err.code))) {
      this.set('access.enabled', true);

      this.send('logout', transition, (transition.targetName !== 'authenticated.index'));
      return;
    }
    this.replaceWith(transition.targetName);

    return ret;
  },

  decideCode(code) {
    if (code === "502" || code === "500") {
      return false;
    }
  },

  cbFind(type, store = 'store', opt = null) {
    return (results, cb) => {
      if (typeof results === 'function') {
        cb = results;
        results = null;
      }

      return this.get(store).find(type, null, opt).then(function(res) {
        cb(null, res);
      }).catch(function(err) {
        cb(err, null);
      });
    };
  },

  loadSettings() {
    return this.get('userStore').find('settingsmap', null, {
      url: 'origins/rioos_system/settingsmap/cluster_info'
    });
  },


  loadDataCenter() {
    return this.get('store').find('reportsstatistics', null, this.opts('healthz/overall'));
  },

  loadStacks() {
    return this.get('store').find('assembly', null, this.opts('accounts/' + this.get('session').get("id") + '/assemblys'));
  },


  loadSecrets() {
    return this.get('store').find('secret', null, this.opts('accounts/' + this.get('session').get("id") + '/secrets'));
  },

  loadEvents() {
    return this.get('store').find('event', null, this.opts('accounts/' + this.get('session').get("id") + '/audits'));
  },

  actions: {
    error(err, transition) {
      // Unauthorized error, send back to login screen
      if (err.code === 401) {
        this.send('logout', transition, true);
        return false;
      } else {
        // Bubble up
        return true;
      }
    },

    showAbout() {
      this.controllerFor('application').set('showAbout', true);
    },

    switchProject(projectId, transition = true) {
      this.disconnectSubscribe(() => {
        this.send('finishSwitchProject', projectId, transition);
      });
    },

    finishSwitchProject(projectId, transition) {
      this.get('storeReset').reset();
      if (transition) {
        this.intermediateTransitionTo('authenticated');
      }
      this.set(`tab-session.${C.TABSESSION.PROJECT}`, projectId);
      this.refresh();
    },
  },
});
