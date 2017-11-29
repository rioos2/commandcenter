import Ember from 'ember';
import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Service.extend(DefaultHeaders, {
  userStore: Ember.inject.service('store'),
  cookies: Ember.inject.service(),
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  /*github:  Ember.inject.service(),
  shibbolethAuth: Ember.inject.service(),
  store: Ember.inject.service(),
  userStore: Ember.inject.service('user-store'),

  token: null,
  loadedVersion: null,

  testAuth: function() {
    // make a call to api base because it is authenticated
    return this.get('userStore').rawRequest({
      url: '',
    }).then((xhr) => {
      let loaded = this.get('loadedVersion');
      let cur = xhr.headers.get(C.HEADER.RANCHER_VERSION);

      // Reload if the version changes
      if ( loaded && cur && loaded !== cur ) {
        window.location.href = window.location.href;
        return;
      }

      // Auth token still good
      return Ember.RSVP.resolve('Auth Succeeded');
    }, () => {
      // Auth token expired
      return Ember.RSVP.reject('Auth Failed');
    });
  },

  // The identity from the session isn't an actual identity model...
  identity: function() {
    var obj = this.get('session.'+C.SESSION.IDENTITY) || {};
    obj.type = 'identity';
    return this.get('userStore').createRecord(obj);
  }.property('session.'+C.SESSION.IDENTITY),*/

  // These are set by authenticated/route
  // Is access control enabled
  enabled: null,

  // What kind of access control
  /*  provider: null,

    // Are you an admin
    admin: null,*/

  /*detect: function() {
    if ( this.get('enabled') !== null ) {
      return Ember.RSVP.resolve();
    }
    return this.get('userStore').rawRequest({
      url: 'token',
    })
    .then((xhr) => {
      // If we get a good response back, the API supports authentication
      var token = xhr.body.data[0];

      this.setProperties({
        'enabled': token.security,
        'provider': (token.authProvider||'').toLowerCase(),
        'loadedVersion': xhr.headers.get(C.HEADER.RANCHER_VERSION),
      });

      this.set('token', token);

      if (this.shibbolethConfigured(token)) {
        this.get('shibbolethAuth').set('hasToken', token);
        this.get('session').set(C.SESSION.USER_TYPE, token.userType);
      } else if ( !token.security ) {
        this.clearSessionKeys();
      }

      return Ember.RSVP.resolve(undefined,'API supports authentication'+(token.security ? '' : ', but is not enabled'));
    })
    .catch((err) => {
      // Otherwise this API is too old to do auth.
      this.set('enabled', false);
      this.set('app.initError', err);
      return Ember.RSVP.resolve(undefined,'Error determining API authentication');
    });
  }, */

  detect: function() {
    this.setProperties({
      'enabled': true,
      //        'provider': "githubconfig",
      'loadedVersion': "data",
    });
  },

  /*shibbolethConfigured: function(token) {
    let rv = false;
    if ((token.authProvider||'') === 'shibbolethconfig' && token.userIdentity) {
      rv = true;
    }
    return rv;
  },*/

  storeDefaultOrigin: function(id) {
    return this.get('store').find('origin', id, {
      url: 'origins/' + id
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
      return this.storeDefaultOrigin(auth.id).then((origin) => {
        origin = {
          origin: origin.object_meta.origin
        };
        session.setProperties($.extend(interesting, origin));
        return xhr;
      });

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
        secure: window.location.protocol === 'http:'
      });
      session.setProperties(interesting);
      return this.storeDefaultOrigin(auth.id).then((origin) => {
        origin = {
          origin: origin.object_meta.origin
        };
        session.setProperties($.extend(interesting, origin));
        return xhr;
      });
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

  isLoggedIn: function() {
    /*we used cookie storage, but cookie doesn't work*/
    var session = this.get('session');
    //return !!this.get('cookies').get(C.COOKIE.TOKEN);
    return !!session.get("token");
  },

  isOwner: function() {
    let schema = this.get('store').getById('schema', 'stack');
    if (schema && schema.resourceFields.system) {
      return schema.resourceFields.system.create;
    }

    return false;
  }
});
