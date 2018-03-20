// var fs = require('fs');
// var path = require('path');
// var http2 = require('http2');
// var urlParse = require('url').parse;
// import Fs from 'npm:fs';
// import path from 'npm:path';
// import HttpTwo from 'npm:http2';
// import Url from 'npm:url';



export default Ember.Object.extend(Ember.Evented, {

connect(metadata) {

  this.set('metadata', metadata || this.get('metadata') || {});

  var options = {
  //   Url : {
  // protocol: 'https:',
  // slashes: true,
  // auth: null,
  // host: 'localhost:8443',
  // port: '8443',
  // hostname: 'localhost',
  // hash: null,
  // search: null,
  // query: null,
  // pathname: '/api/v1/assembly_factory/watch',
  // path: '/api/v1/assembly_factory/watch',
  // href: 'https://localhost:8443/api/v1/assembly_factory/watch',
  // plain: false },
  };


  options.url = this.get('url');
  // Optionally verify self-signed certificates.
  // if (options.hostname == 'localhost') {
    // options.key = Fs.readFileSync(path.join(__dirname, '/home/rathish/rio/config/keys/client-nodelet.key'));
    // options.ca = Fs.readFileSync(path.join(__dirname, '/home/rathish/rio/config/keys/client-nodelet.crt'));
  // }
  options.rejectUnauthorized = false;

  var request = HttpTwo.get(options);

  // Receiving push streams
  request.on('push', function(pushRequest) {
    // var filename = path.join(__dirname, '/push-' + push_count);
    push_count += 1;
    console.error('Receiving pushed resource: ' + pushRequest.url + ' -> ' + filename);
    pushRequest.on('response', function(pushResponse) {
      // pushResponse.pipe(Fs.createWriteStream(filename)).on('finish', finish);
    });
  });
},

});
