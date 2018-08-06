import DefaultHeaders from 'nilavu/mixins/default-headers';
import C from 'nilavu/utils/constants';
import Service from '@ember/service';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Service.extend(DefaultHeaders, {
  cookies: service(),
  session: service(),

  store:     service(),
  userStore: service('user-store'),

  // These are set by authenticated/route
  // Is access control enabled
  enabled: null,

  // What kind of access control provider
  // For now its default.
  provider: null,

  // Are you an admin
  admin: null,

  // TO-DO: +Optional
  // Include a promise handler to check if a token (API) exists or not
  // For now, consider as Auth token expired

  testAuth() {
    return Ember.RSVP.resolve('Auth Succeeded');
    // TODO
    // // make a call to api base because it is authenticated
    // return this.get('userStore').rawRequest(this.rawRequestOpts({ url: '/api/v1/test', })).then((xhr) => {
    //   // Auth token still good
    //   return Ember.RSVP.resolve('Auth Succeeded');
    // }, (/* err */) => {
    //   // Auth token expired
    //   return Ember.RSVP.reject('Auth Failed');
    // });
  },

  detect() {
    if (this.get('enabled') !== null) {
      return Ember.RSVP.resolve();
    }
    this.setProperties({
      'enabled':       true,
      'provider':      'password',
      'loadedVersion': '2.0-beta1',
    });
  },

  login(username, password) {
    var session = this.get('session');

    return this.get('userStore').rawRequest({
      url:    '/api/v1/authenticate',
      method: 'POST',
      data:   {
        email:    username,
        password,
      },
    }).then((xhr) => {
      var auth = xhr.body;
      var interesting = {};
      var origin;

      C.TOKEN_TO_SESSION_KEYS.forEach((key) => {
        // TO-DO origin and team will not  work here. since it placed on sub level
        // Use flat npm for fix this
        if (typeof auth[key] !== 'undefined') {
          interesting[key] = auth[key];
        }
      });
      this.get('cookies').setWithOptions(C.COOKIE.TOKEN, auth.token, {
        path:   '/',
        secure: window.location.protocol === 'http:'
      });

      session.setProperties(interesting);

      return xhr;
    }).catch((res) => {
      let err;

      try {
        err = res.body;
      } catch (e) {
        err = {
          type:    'error',
          message: 'Error logging in'
        };
      }

      return Ember.RSVP.reject(err);
    });
  },

  activate() {
    return this.get('userStore').rawRequest({
      url:    '/api/v1/wizards',
      method: 'GET',
    }).then((xhr) => {
      var res;

      if (xhr.body) {
        res = xhr.body.registered && xhr.body.licensed
      }

      return res;
    }).catch((err) => {
      return Ember.RSVP.reject(err);
    });
  },

  signup(form) {
    var session = this.get('session');

    return this.get('userStore').rawRequest({
      url:    '/api/v1/accounts',
      method: 'POST',
      data:   form,
    }).then((xhr) => {
      var auth = xhr.body;
      var interesting = {};
      var origin;

      C.TOKEN_TO_SESSION_KEYS.forEach((key) => {
        if (typeof auth[key] !== 'undefined') {
          interesting[key] = auth[key];
        }
      });
      this.get('cookies').setWithOptions(C.COOKIE.TOKEN, auth.token, {
        path:   '/',
        secure: window.location.protocol === 'https:'
      });

      session.setProperties(interesting);

      return xhr;
    }).catch((res) => {
      let err;

      try {
        err = res.body;
      } catch (e) {
        err = {
          type:    'error',
          message: 'Error logging in'
        };
      }

      return Ember.RSVP.reject(err);
    });
  },

  clearSessionKeys(all, out = false) {
    if (all === true) {
      this.get('session').clear();
    } else {
      var values = {};

      C.TOKEN_TO_SESSION_KEYS.forEach((key) => {
        values[key] = undefined;
      });

      this.get('session').setProperties(values);
    }
    this.get('cookies').remove(C.COOKIE.TOKEN);
    if (out === true) {
      location.reload();
    }
  },

  sessionClearRequest() {
    return this.get('userStore').rawRequest(this.rawRequestOpts({
      url:    '/api/v1/logout',
      method: 'POST',
      data:   {
        email: this.get('session').get('email'),
        token: this.get('session').get('token'),
      },
    })).then((xhr) => {
      this.clearSessionKeys(true, true);
    }).catch((res) => {
      this.clearSessionKeys(true, true);
    });
  },

  isLoggedIn() {
    return !!this.get('cookies').get(C.COOKIE.TOKEN);
  },

});
