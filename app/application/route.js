import Ember from 'ember';
import C from 'nilavu/utils/constants';
import {
  messageNow
} from '../utils/message';

export default Ember.Route.extend({
  access: Ember.inject.service(),
  cookies: Ember.inject.service(),
  language: Ember.inject.service('user-language'),
  settings: Ember.inject.service(),
  modal: Ember.inject.service(),
  events: Ember.inject.service('es6-eventemitter'),

  previousParams: null,
  previousRoute: null,
  loadingShown: false,
  loadingId: 0,
  hideTimer: null,
  previousLang: null,

  actions: {

      loading(transition) {
        let controller = this.controllerFor('application');
        controller.set('pageLoader', true);
        setTimeout(function() {
          transition.promise.finally(function() {
            controller.set('pageLoader', false);
          });
        }, 3000);
        return true;
      },

    error(err, transition) {
      /*if we dont abort the transition we'll call the model calls again and fail transition correctly*/
      transition.abort();
      if (err && err.status && [401, 403].indexOf(err.status) >= 0) {
        this.send('logout', transition, true);
        return;
      }

      this.controllerFor('application').set('error', err);
      this.transitionTo('failWhale');

      console.log('» [ ✘ ] -----------------');
      console.log('» [ ✘ ] Application Error', (err ? err.stack : undefined));
      console.log('» [ ✘ ] -----------------');

    },

    goToPrevious(def) {
      this.goToPrevious(def);
    },

    trackUsage(id, opts) {
      this.trackUsage(id, opts);
    },

    finishLogin() {
      this.finishLogin();
    },

    logout(transition, timedOut, errorMsg) {
      let session = this.get('session');
      let access = this.get('access');

      access.clearToken().finally(() => {
        session.set(C.SESSION.ACCOUNT_ID, null);

        this.get('tab-session').clear();

        access.clearSessionKeys();

        if (transition && !session.get(C.SESSION.BACK_TO)) {
          session.set(C.SESSION.BACK_TO, window.location.href);
        }

        let params = {
          queryParams: {}
        };

        if (timedOut) {
          params.queryParams.timedOut = true;
        }

        if (errorMsg) {
          params.queryParams.errorMsg = errorMsg;
        }

        this.transitionTo('login', params);
      });
    },

  },

  /// Usage tracker which sends analytics information to countly.
  trackUsage(id, opts) {
    let msg = messageNow(id, opts);
    if (msg) {
      this.get('events').emit(id, msg);
    }
  },

  finishLogin() {
    let session = this.get('session');

    let backTo = session.get(C.SESSION.BACK_TO);
    session.set(C.SESSION.BACK_TO, undefined);

    if (backTo) {
      window.location.href = backTo;
    } else {
      this.replaceWith('authenticated');
    }
  },

  model(params, transition) {
    this.get('language').initLanguage();

    transition.finally(() => {
      this.controllerFor('application').setProperties({
        state: null,
        code: null,
        error_description: null,
        redirectTo: null,
      });
    });

    if (params.redirectTo) {
      let path = params.redirectTo;
      if (path.substr(0, 1) === '/') {
        this.get('session').set(C.SESSION.BACK_TO, path);
      }
    }

    if (params.isPopup) {
      this.controllerFor('application').set('isPopup', true);
    }

    this.controllerFor('application').set('error', params);

    console.log("[»] ✔ application");
  },

  updateWindowTitle: function() {
    document.title = this.get('settings.appName') || 'Rio/OS';
  }.observes('settings.appName'),

  beforeModel() {
    this.updateWindowTitle();

    let agent = window.navigator.userAgent.toLowerCase();

    if (agent.indexOf('msie ') >= 0 || agent.indexOf('trident/') >= 0) {
      this.replaceWith('ie');
      return;
    }

    // Find out if auth is enabled
    return this.get('access').detect();
  },
});
