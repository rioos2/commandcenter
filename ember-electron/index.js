var path = require('path');
var Url = require('url');
var ForeverAgent = require('forever-agent');
var HttpProxy = require('http-proxy');
var fs = require('fs');
var toml = require('toml-parser');
var http = require('http');

const loaded = readUIConfig();
if (loaded) {
  console.log("✔ ui config loaded.");
} else {
  console.error("✘ ui config load failed.\n" + loaded);
}

const APISERVER = loaded.http_api;
const APIENDPOINT = '/api/v1';
var proxy = HttpProxy.createProxyServer({
    ws: true,
    xfwd: false,
    target: APISERVER,
    secure: false,
});

const CONTAINER_CONSOLE = "containerconsole";
const MACHINE_CONSOLE = "machineconsole";

proxy.on('error', onProxyError);

let map = {
  'API': APIENDPOINT
};

// Rio/OS API
console.log('Proxying API to', APISERVER);
var proxyServer = http.createServer(function (req, res) {  
  proxyLog("API", req);
  proxy.web(req, res);
});

//
// Listen to the `upgrade` event and proxy the
// WebSocket requests as well.
//
proxyServer.on('upgrade', function (req, socket, head) {
  var target = loaded.uwatch_server;
  proxyLog("WEBSOCKET", req);
  proxy.ws(req, socket, { target: target,
    ws: true,
  });
});

proxyServer.listen(8000);

function readUIConfig() {
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

function onProxyError(err, req, res) {
  console.log('Proxy Error on ' + req.method + ' to', req.url, err);
  var error = {
    type: 'error',
    status: 500,
    code: 'ProxyError',
    message: 'Error connecting to proxy',
    detail: err.toString()
  }

  if (req.upgrade) {
    res.end();
    console.log("---- Proxy error: upgrade");
  } else {
    res.writeHead(500, {
      'Content-Type': 'application/json'
    });
    console.log("---- Proxy error: res.end");
    res.end(JSON.stringify(error));
  }
}

function proxyLog(label, req) {
  console.log('==>', '[' + label + ']', req.method, req.url);
  console.log('==>', '[' + label + ']', req.headers, req.url);
  console.log("------------------------------------");
  console.log('[' + label + ']', req.method, req.url);
}


