/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
const environment = process.env.EMBER_ENV;
const isTesting = environment === 'test';

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {

    fingerprint: {
      exclude: [
        // These can be bind-mounted in
        'assets/images',
      ],
      extensions: (['js', 'css', 'png', 'jpg', 'gif', 'svg', 'map', 'woff', 'woff2', 'ttf']),
    },
    minifyJS: {
      enabled: false
    },
    minifyCSS: {
      enabled: true
    },
    //For disable eslint when yarn test
    // hinting: !isTesting,
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.


  // app.import('bower_components/bootstrap/dist/css/bootstrap.css');
  // app.import('bower_components/bootstrap/dist/css/bootstrap.css.map', {
  //     destDir: 'assets'
  // });

  app.import('vendor/charts/d3.min.js');
  app.import('vendor/charts/d3script-area.js');
  app.import('vendor/charts/d3script-gauge.js');
  app.import('vendor/charts/d3script-blue-gauge.js');
  app.import('vendor/charts/topojson.v0.min.js');


  app.import('node_modules/@bower_components/jquery/dist/jquery.js');
  app.import('vendor/charts/d3script-storage.js');
  app.import('vendor/charts/d3script-ram.js');
  app.import('vendor/charts/d3script-cores.js');
  app.import('vendor/charts/loader.js');
  app.import('vendor/dropdown/position-calculator.js');

  app.import('vendor/analytics/countly.js');

  app.import('vendor/versor.js');
  app.import('vendor/novnc.js');
  app.import('vendor/EasePack.min.js');
  app.import('vendor/TweenLite.min.js');
  app.import('vendor/moment.js');
  app.import('vendor/charts/d3script-globe.js');
  app.import('vendor/admin/jquery-scrollbar.js');

  app.import('node_modules/@bower_components/async/dist/async.js');

  app.import('node_modules/@bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot', {
    destDir: 'fonts'
  });
  app.import('node_modules/@bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf', {
    destDir: 'fonts'
  });
  app.import('node_modules/@bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg', {
    destDir: 'fonts'
  });
  app.import('node_modules/@bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff', {
    destDir: 'fonts'
  });
  app.import('node_modules/@bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2', {
    destDir: 'fonts'
  });
  app.import('node_modules/@bower_components/lacsso/lacsso.css');

  app.import('node_modules/@bower_components/bootstrap/dist/js/bootstrap.js');

  return app.toTree();
};
