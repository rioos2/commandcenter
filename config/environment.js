/* jshint node: true */
var pkg = require('../package.json');
var fs = require('fs');
var path = require('path');
var YAML = require('yamljs');
var toml = require('toml-parser');

// host can be an ip "1.2.3.4" -> http://1.2.3.4:8080
// or a URL+port
function normalizeHost(host, defaultPort) {
  if (host.indexOf('http') !== 0) {
    if (host.indexOf(':') === -1) {
      host = 'http://' + host + (defaultPort ? ':' + defaultPort : '');
    } else {
      host = 'http://' + host;
    }
  }

  return host;
}


/* Parse the translations from the translations folder*/
/* ember intl getLocalesByTranslations does not work if intl is not managing them (bundled) */
/* This needs a little work to read the yaml files for the langugae name prop*/
function readLocales(environment) {
  var files = fs.readdirSync('./translations');
  var translationsOut = {};
  files.forEach(function (filename) {
    if (!filename.match(/\.ya?ml$/) && !filename.match(/\.json$/)) {
      // Ignore non-YAML files
      return;
    }

    if (environment === 'production' && filename === 'none.yaml') {
      // Don't show the "None" language in prod
      return;
    }
    var ymlFile = YAML.load('./translations/' + filename);
    var label = ymlFile.languageName;
    var locale = filename.split('.')[0];
    translationsOut[locale] = label;
  });
  return translationsOut;
}
//
//
function readUIConfig(environment) {
  if (!process.env.RIOOS_HOME) {
    process.env.RIOOS_HOME = path.join(__dirname);
  }

  const uiConfigPath = path.join(process.env.RIOOS_HOME, 'config', 'ui.toml');
  console.info("✔ ui config path =" + uiConfigPath);

  const tomlStr = fs.readFileSync(uiConfigPath, 'utf-8');

  if (tomlStr) {
    return toml(tomlStr);
  }
}

module.exports = function (environment) {
  const loaded = readUIConfig(environment);
  if (loaded) {
    console.log("✔ ui config loaded.");
  } else {
    console.error("✘ ui config load failed.\n" + loaded);
  }

  var ENV = {
    modulePrefix: 'nilavu',
    environment: environment,
    exportApplicationGlobal: true,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    // ember-cli-notifications: {
    //   includeFontAwesome: true,
    //   icons: 'bootstrap'
    // },

    minifyCSS: {
      enabled: false
    },

    minifyJS: {
      enabled: false
    },

    contentSecurityPolicy: {
      'style-src': "'self' console.rioos.xyz ui.rioos.svc.local localhost:3000 'unsafe-inline'",
      'font-src': "'self' console.rioos.xyz ui.rioos.svc.local",
      'script-src': "'self' console.rioos.xyz ui.rioos.svc.local localhost:3000",
      'object-src': "'self' console.rioos.xyz ui.rioos.svc.local",
      'img-src': "'self' console.rioos.xyz ui.rioos.svc.local avatars.githubusercontent.com gravatar.com localhost:3000 data:",
      'frame-src': "'self' console.rioos.xyz ui.rioos.svc.local",

      // Allow connect to anywhere, for console and event stream socket
      'connect-src': '*'
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      version: pkg.version,
      appName: 'Rio/OS - ' + pkg.version,
      apiServer: loaded.http_api || "http://localhost:9636",
      apiEndpoint: '/api/v1',
      authServer: loaded.auth_server || "http://localhost:9636",
      authEndpoint: '/api/v1',
      wsServer: loaded.watch_server || "ws://localhost:9443",
      wsEndpoint: '/api/v1/',
      vncServer: loaded.vnc_server || "wss://localhost:8005",
      countlyServer: loaded.countly_server || "http://countly.rioos.xyz",
      appKey: loaded.app_key || "9653325d8d0f5fe63c3491c93259bf4ff77821ca",
      sendAnalytics: loaded.send_analytics || false,
      baseAssets: '/',
      locales: readLocales(environment)
    },
  };

  if (environment === 'development') {
    ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = true;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }



  if (process.env.BASE_URL) {
    ENV.baseURL = process.env.BASE_URL;
  }

  ENV.APP.baseURL = ENV.baseURL;

  if (process.env.FINGERPRINT) {
    ENV.APP.fingerprint = process.env.FINGERPRINT;
  }

  if (process.env.BASE_ASSETS) {
    ENV.APP.baseAssets = process.env.BASE_ASSETS;
  }

  // Override the Rancher server/endpoint with environment var
  var server = process.env.NILAVU;

  if (server) {
    ENV.APP.apiServer = normalizeHost(server, 8080);
  } else if (environment === 'production') {
    ENV.APP.apiServer = '';
  }

  var pl = process.env.PL;
  if (pl) {
    ENV.APP.pl = pl;
  } else {
    ENV.APP.pl = 'nilavu';
  }

  return ENV;
};
