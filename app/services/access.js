import Ember from 'ember';
import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
// import fs from 'npm:fs';
import FS from 'npm:fs-js';

export default Ember.Service.extend(DefaultHeaders, {
  cookies: Ember.inject.service(),
  session: Ember.inject.service(),

  store: Ember.inject.service(),
  userStore: Ember.inject.service('user-store'),

  // These are set by authenticated/route
  // Is access control enabled
  enabled: null,

  // What kind of access control provider
  // For now its default.
  provider: null,

  // Are you an admin
  admin: null,

  // TO-DO: +Optional
  //Include a promise handler to check if a token (API) exists or not
  // For now, consider as Auth token expired
  testAuth() {
    // make a call to api base because it is authenticated
    return this.get('userStore').rawRequest({
      url: '/version',
    }).then((xhr) => {
      // Auth server can be reached
      return Ember.RSVP.reject('Auth Succeeded');
    }, ( /* err */ ) => {
      // Auth server can be reached
      return Ember.RSVP.reject('Auth Failed');
    });
  },

  detect: function() {
    if (this.get('enabled') !== null) {
      return Ember.RSVP.resolve();
    }
    this.setProperties({
      'enabled': true,
      'provider': 'password',
      'loadedVersion': '2.0-beta1',
    });
  },

  login: function(username, password) {
    var session = this.get('session');
    return this.get('userStore').rawRequest({
      url: '/api/v1/authenticate',
      method: 'POST',
      data: {
        email: username,
        password: password,
      },
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
        path: '/',
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
          type: 'error',
          message: 'Error logging in'
        };
      }
      return Ember.RSVP.reject(err);
    });
  },

  wizardPageRedirect: function() {
    return this.get('userStore').rawRequest({
      url: '/setupcheck',
      method: 'GET',
    }).then((xhr) => {
      var res;
      if (xhr.body) {
        res = JSON.parse(xhr.body).verified
      }
      return res;
    }).catch((err) => {
      return Ember.RSVP.reject(err);
    });
  },

  createConfigFile: function() {
    return this.get('userStore').rawRequest({
      url: '/config',
      method: 'GET',
    }).then((xhr) => {
      var res;
      if (xhr.body) {
        res = JSON.parse(xhr.body)
      }
      return res;
    }).catch((res) => {
      return Ember.RSVP.reject(err);
    });
  },

  signup: function(form) {
    var session = this.get('session');
    return this.get('userStore').rawRequest({
      url: '/api/v1/accounts',
      method: 'POST',
      data: form,
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
        path: '/',
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
          type: 'error',
          message: 'Error logging in'
        };
      }
      return Ember.RSVP.reject(err);
    });
  },

  clearSessionKeys: function(all, out = false) {
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

  sessionClearRequest: function() {
    return this.get('userStore').rawRequest(this.rawRequestOpts({
      url: '/api/v1/logout',
      method: 'POST',
      data: {
        email: this.get('session').get("email"),
        token: this.get('session').get("token"),
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

  // TO-DO: _Optional.
  // Include a promise handler to delete a token (API) if exists
  // For now, consider as Auth token expired
  clearToken() {
    return Ember.RSVP.resolve('Token cleared');
  },

  isOwner() {
    let schema = this.get('store').getById('schema', 'stack');
    if (schema && schema.resourceFields.system) {
      return schema.resourceFields.system.create;
    }

    return false;
  }

});
