module.exports = function(app, options) {
  var path = require('path');
  var ForeverAgent = require('forever-agent');
  var HttpProxy = require('http-proxy');
  var httpServer = options.httpServer;

  var config = require('../../config/environment')().APP;

  var proxy = HttpProxy.createProxyServer({
    ws: true,
    xfwd: false,
    target: config.apiServer,
    secure: false,
  });

  proxy.on('error', onProxyError);

  // WebSocket for Rancher
  httpServer.on('upgrade', function proxyWsRequest(req, socket, head) {
    proxyLog('WS', req);
    if (socket.ssl) {
      req.headers['X-Forwarded-Proto'] = 'https';

    }
    proxy.ws(req, socket, head);
  });

  let map = {
    'API': config.apiEndpoint,
    'OAPI': config.oapiEndpoint,
    'Legacy API': config.legacyApiEndpoint,
    'Telemetry': config.telemetryEndpoint,
    'WebHook': config.webhookEndpoint,
  }

  app.use('/api/v1/mockapi', function(req, res, next) {
    var json = mockjson();
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(json));
  });


  // Rancher API
  console.log('Proxying API to', config.apiServer);
  Object.keys(map).forEach(function(label) {
    let base = map[label];
    app.use(base, function(req, res, next) {
      // include root path in proxied request
      req.url = path.join(base, req.url);
      req.headers['X-Forwarded-Proto'] = req.protocol;

      proxyLog(label, req);
      proxy.web(req, res);
    });
  });

  // Kubernetes needs this API
  app.use('/swaggerapi', function(req, res, next) {
    // include root path in proxied request
    req.url = path.join('/swaggerapi', req.url);
    req.headers['X-Forwarded-Proto'] = req.protocol;

    proxyLog('K8sSwag', req);
    proxy.web(req, res);
  });

  app.use('/version', function(req, res, next) {
    // include root path in proxied request
    req.url = '/version';
    req.headers['X-Forwarded-Proto'] = req.protocol;

    proxyLog('K8sVers', req);
    proxy.web(req, res);
  });

  // Catalog API
  var catalogPath = config.catalogEndpoint;
  // Default catalog to the regular API
  var catalogServer = config.catalogServer || config.apiServer;
  if (catalogServer !== config.apiServer) {
    console.log('Proxying Catalog to', catalogServer);
  }
  app.use(catalogPath, function(req, res, next) {
    req.headers['X-Forwarded-Proto'] = req.protocol;
    var catalogProxy = HttpProxy.createProxyServer({
      xfwd: false,
      target: catalogServer
    });

    catalogProxy.on('error', onProxyError);

    // include root path in proxied request
    req.url = path.join(catalogPath, req.url);

    proxyLog('Catalog', req);
    catalogProxy.web(req, res);
  });

  // Auth API
  var authPath = config.authEndpoint;
  var authServer = config.authServer || config.apiServer;
  if (authServer !== config.apiServer) {
    console.log('Proxying Auth to', authServer);
  }
  app.use(authPath, function(req, res, next) {
    req.headers['X-Forwarded-Proto'] = req.protocol;
    var catalogProxy = HttpProxy.createProxyServer({
      xfwd: false,
      target: authServer
    });

    catalogProxy.on('error', onProxyError);

    req.url = path.join(authPath, req.url);

    proxyLog('Auth', req);
    catalogProxy.web(req, res);
  });
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
  } else {
    res.writeHead(500, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(error));
  }
}

function proxyLog(label, req) {
  console.log('==>', '[' + label + ']', req.method, req.url);
  console.log('==>', '[' + label + ']', req.headers, req.url);
  console.log("------------------------------------");
  console.log('[' + label + ']', req.method, req.url);
}


var mockjson = function() {
  return {
    kind: "ReportsStatistics",
    apiVersion: "v1",
    metadata: {
      selfLink: "/api/v1/reports",
      resourceVersion: "325"
    },
    id: "12345",
    results: {
      title: "Command center operations",
      guages: guages(),
      statistics: statistics(),
      osusages: osusages(),
      from_date: "",
      to_date: ""
    }
  };
};

var osArray = [
  'ubuntu',
  'windows',
  'apple'
];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

function guages() {
  return {
    title: "Cumulative operations counter",
    counters: [{
        name: "cpu",
        description: "CPU ..Throttled",
        cpu: "percentage",
        counter: getRandomInt(1, 100).toString()
      },
      {
        name: "ram",
        description: "RAM ..Throttled",
        cpu: "percentage",
        counter: getRandomInt(1, 100).toString()
      },
      {
        name: "disk",
        description: "DISK ..Throttled",
        cpu: "percentage",
        counter: getRandomInt(1, 100).toString()
      }
    ]
  };
};

function statistics() {
  return {
    title: "Statistics of the nodes",
    nodes: [{
        kind: "Node",
        apiVersion: "v1",
        metadata: {
          selfLink: "/api/v1/node",
          resourceVersion: "325"
        },
        id: "34567",
        name: "192.168.1.100",
        description: "CPU ..Throttled",
        cpu: "percentage",
        counter: getRandomInt(1, 100).toString(),
        cost_of_consumption: getRandomInt(1000, 2000).toString() + " USD",
        health: "green/red/yellow"
      },
      {
        kind: "Node",
        apiVersion: "v1",
        metadata: {
          selfLink: "/api/v1/node",
          resourceVersion: "325"
        },
        id: "67895",
        name: "192.168.1.101",
        description: "CPU ..Throttled",
        cpu: "percentage",
        counter: getRandomInt(1, 100).toString(),
        cost_of_consumption: getRandomInt(1000, 2000).toString() + " USD",
        health: "green/red/yellow"
      }
    ]
  };
};

function osusages() {
  var randomNumber = Math.floor(Math.random() * osArray.length);
  return {
    title: "Operating systems consumed",
    from_date: "2001-01-11:10:1010Z",
    to_date: "2011-01-11:10:1010Z",
    cumulative: {
      cpu: "percentage",
      counter: getRandomInt(1, 100).toString(),
      alerts: "no"
    },
    item: [{
        id: "ubuntu",
        name: "ubuntu",
        values: [{
          date: 'Fri Jan 01 2017 00:00:00 GMT+0400',
          value: getRandomInt(10, 100)
        }, {
          date: 'Fri Jan 02 2017 00:00:00 GMT+0400 ',
          value: getRandomInt(10, 100)
        }, {
          date: 'Fri Jan 03 2017 00:00:00 GMT+0400 ',
          value: getRandomInt(10, 100)
        }]
      },
      {
        id: "apple",
        name: "apple",
        values: [{
          date: 'Fri Jan 01 2017 00:00:00 GMT+0400',
          value: getRandomInt(10, 100)
        }, {
          date: 'Fri Jan 02 2017 00:00:00 GMT+0400 ',
          value: getRandomInt(10, 100)
        }, {
          date: 'Fri Jan 03 2017 00:00:00 GMT+0400 ',
          value: getRandomInt(10, 100)
        }]
      },
    ]
  };
}
