/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // SRI: {
    //   enabled: false
    // },
    // fingerprint: {
    //   enabled: false
    // },
    // minifyJS: {
    //   enabled: false
    // },
    // minifyCSS: {
    //   enabled: true
    // },
    // Add options here
    // lessOptions: {
    //   paths: [
    //     'bower_components/bootstrap/less'
    //   ],
    // },
    // sassOptions: {
    //   includePaths: [
    //     'bower_components/SpinKit/scss',
    //   ]
    // }
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

  app.import('vendor/charts/d3.v4.min.js');
  app.import('vendor/charts/d3script-area.js');
  app.import('vendor/charts/d3script-gauge.js');
  app.import('vendor/charts/d3script-blue-gauge.js');


  app.import('vendor/charts/d3script-storage.js');
  app.import('vendor/charts/d3script-ram.js');
  app.import('vendor/charts/d3script-cores.js');
  app.import('vendor/charts/loader.js');
  app.import('vendor/dropdown/position-calculator.js');

  app.import('vendor/analytics/countly.js');

  app.import('vendor/novnc.js');
  app.import('vendor/EasePack.min.js');
  app.import('vendor/TweenLite.min.js');
  app.import('vendor/moment.js');

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
