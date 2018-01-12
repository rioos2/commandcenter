import Ember from 'ember';
import C from 'nilavu/utils/constants';
import Subscribe from 'nilavu/mixins/subscribe';
import {
  xhrConcur
} from 'nilavu/utils/platform';
import PromiseToCb from 'nilavu/mixins/promise-to-cb';
import DefaultHeaders from 'nilavu/mixins/default-headers';

const CHECK_AUTH_TIMER = 60 * 10 * 1000;

export default Ember.Route.extend(Subscribe, PromiseToCb, DefaultHeaders,{
  access: Ember.inject.service(),
  storeReset: Ember.inject.service(),
  // settings  : Ember.inject.service(),
  store: Ember.inject.service(),



  testTimer: null,

  beforeModel(transition) {
    this._super.apply(this, arguments);
    if (this.get('access.enabled')) {
      if (this.get('access').isLoggedIn()) {
        //this.testAuthToken();
        this.controllerFor('application').set("shownavbar", true);
        transition.send('finishLogin');
      } else {
        transition.send('logout', transition, false);
        return Ember.RSVP.reject('Not logged in');
      }
    }
  },

  testAuthToken: function() {
    let timer = Ember.run.later(() => {
      this.get('access').testAuth().then(( /* res */ ) => {
        this.testAuthToken();
      }, ( /* err */ ) => {
        this.send('login', null, true);
      });
    }, CHECK_AUTH_TIMER);

    this.set('testTimer', timer);
  },

  model(params, transition) {
    // Save whether the user is admin
    console.log("=======================model==============================");
    let type = this.get(`session.${C.SESSION.USER_TYPE}`);

    let isAdmin = (type === C.USER.TYPE_ADMIN) || !this.get('access.enabled');

    this.set('access.admin', isAdmin);

    let promise = new Ember.RSVP.Promise((resolve, reject) => {
      let tasks = {
        // settingsMap: this.toCb('settingsMap'),
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
    if (!this.controllerFor('application').get('isPopup') && this.get('projects.current')) {
      this.connectSubscribe();
    }

    if (this.get('settings.isRancher') && !app.get('isPopup')) {
      let form = this.get(`settings.${C.SETTING.FEEDBACK_FORM}`);

      //Show the telemetry opt-in
      let opt = this.get(`settings.${C.SETTING.TELEMETRY}`);
      if (this.get('access.admin') && (!opt || opt === 'prompt')) {
        /*Ember.run.scheduleOnce('afterRender', this, function() {
          this.get('modalService').toggleModal('modal-welcome');
        });*/
      } else if (form && !this.get(`prefs.${C.PREFS.FEEDBACK}`)) {
        /*Ember.run.scheduleOnce('afterRender', this, function() {
          this.get('modalService').toggleModal('modal-feedback');
        });*/
      }
    }
  },

  deactivate() {
    this._super();
    this.disconnectSubscribe();
    Ember.run.cancel(this.get('testTimer'));

    // Forget all the things
    this.get('storeReset').reset();
  },

  loadingError(err, transition, ret) {
    let isAuthEnabled = this.get('access.enabled');

    console.log('Loading Error:', err);
    if (err && (isAuthEnabled || [401, 403].indexOf(err.status) >= 0)) {
      this.send('login', transition, (transition.targetName !== 'authenticated.index'));
      return;
    }

    this.replaceWith('settings.projects');
    return ret;
  },

  cbFind(type, url, store = 'store') {
    return (results, cb) => {
      if (typeof results === 'function') {
        cb = results;
        results = null;
      }
      return this.get(store).find(type, null, url).then(function(res) {

        cb(null, res);
      }).catch(function(err) {
        cb(err, null);
      });
    };
  },

  settingsMap() {
    return this.get('store').findAll('settingsMap', this.opts('origins/rioos/settingsmap/cluster_info'));
  },

  loadProjects() {
    let svc = this.get('projects');
    return svc.getAll().then((all) => {
      svc.set('all', all);
      return all;
    });
  },


  actions: {
    error(err, transition) {
      // Unauthorized error, send back to login screen
      if (err.status === 401) {
        this.send('logout', transition, true);
        return false;
      } else {
        // Bubble up
        return true;
      }
    },

  },
});
