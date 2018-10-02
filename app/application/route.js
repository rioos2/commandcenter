import Route from '@ember/routing/route';
import C from 'nilavu/utils/constants';
import { messageNow } from '../utils/message';
import { inject as service } from '@ember/service';
import * as Sentry from '@sentry/browser'

export default Route.extend({
  access:   service(),
  cookies:  service(),
  language: service('user-language'),
  settings: service(),
  modal:    service(),
  // es6-eventemitter is to transmit to events for analytics
  events:   service('es6-eventemitter'),

  // Routes are extended to set previous params and previous route in initializers (initailzers/extend-ember-route)
  previousParams: null,
  previousRoute:  null,

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

  model(params, transition) {
    this.get('language').initLanguage();

    transition.finally(() => {
      this.controllerFor('application').setProperties({ redirectTo: null, });
    });

    if (params.redirectTo) {
      let path = params.redirectTo;

      if (path.substr(0, 1) === '/') {
        this.get('session').set(C.SESSION.BACK_TO, path);
      }
    }

    this.controllerFor('application').set('error', params);

    console.log('[»] ✔ application');
  },

  actions: {

    loading(transition) {
      let controller = this.controllerFor('application');

      controller.set('showLoading', true);
      setTimeout(() => {
        transition.promise.finally(() => {
          controller.set('showLoading', false);
        });
      }, 3000); // Time out in 3 secs

      return true;
    },

    error(err, transition) {
      /* if we dont abort the transition we'll call the model calls again and fail transition correctly*/
      transition.abort();
      if (err && err.status && C.UNAUTHENTICATED_HTTP_CODES.indexOf(err.status) >= 0) {
        this.send('logout', transition, true);

        return;
      }

      this.controllerFor('application').set('error', err);
      if (C.AUTHORIZATION_DENIED.includes(err.code)){
        this.transitionTo('access-denied');
      } else {
        this.transitionTo('failWhale');
      }
      console.log('» [ ✘ ] -----------------');
      console.error('» [ ✘ ] Application Error', (err ? err.stack : undefined));
      console.log('» [ ✘ ] -----------------');

      Sentry.captureException(err);

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

      session.set(C.SESSION.ACCOUNT_ID, null);
      // When we open multiple tab window the tab session used as bowser store.
      // Clear that as well
      this.get('tab-session').clear();

      access.clearSessionKeys();

      if (transition && !session.get(C.SESSION.BACK_TO)) {
        session.set(C.SESSION.BACK_TO, window.location.href);
      }

      // TO-DO verifiy after migrating model internally, remove lacsso
      if (this.get('modal.modalVisible')) {
        this.get('modal').toggleModal();
      }

      let params = { queryParams: {} };

      if (timedOut) {
        params.queryParams.timedOut = true;
      }

      if (errorMsg) {
        params.queryParams.errorMsg = errorMsg;
      }

      this.transitionTo('login', params);

    },

  },

  // Usage tracker which sends analytics information to countly.
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

});
