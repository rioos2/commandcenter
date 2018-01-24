import Ember from 'ember';
import C from 'nilavu/utils/constants';
import Subscribe from 'nilavu/mixins/subscribe';
import { xhrConcur } from 'nilavu/utils/platform';
import PromiseToCb from 'nilavu/mixins/promise-to-cb';

const CHECK_AUTH_TIMER = 60 * 10 * 1000;

export default Ember.Route.extend(Subscribe, PromiseToCb, {
  access: Ember.inject.service(),
  storeReset: Ember.inject.service(),
  settings: Ember.inject.service(),
  userStore: Ember.inject.service('store'),

  testTimer: null,

  beforeModel(transition) {
    this._super.apply(this, arguments);
    if (this.get('access.enabled')) {
      if (this.get('access').isLoggedIn()) {
        this.controllerFor('application').set("shownavbar", true);
        transition.send('finishLogin');
      } else {
        transition.send('logout', transition, false);
        return Ember.RSVP.reject('Not logged in');
      }
    }
  },


  model(params, transition) {
    // Save whether the user is admin

    let promise = new Ember.RSVP.Promise((resolve, reject) => {
      let tasks = {
        settings:                          this.toCb('loadSettings'),
      };
      async.auto(tasks, xhrConcur, function(err, res) {
        if ( err ) {
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
    this._super();
  },

  deactivate() {
    this._super();
    this.get('storeReset').reset();
  },

  loadingError(err, transition, ret) {
    console.log('Loading Error:', err);
    return ret;
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

  loadSettings() {
    return this.get('userStore').find('settingsMap', null, {url: 'origins/rioos_system/settingsmap/cluster_info'});
  },

});
