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

  app.use('/api/v1/mockapiassembly', function(req, res, next) {
    var json = mockjsonAssembly();
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
      // statistics: findStatistics(Math.floor(Math.random() * 2) + 1 ),
      statistics: statisticsTwo(),
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
      },
      {
        name: "gpu",
        description: "GPU ..Throttled",
        cpu: "percentage",
        counter: getRandomInt(1, 100).toString()
      }
    ]
  };
};

var findStatistics = function(which) {
  switch (which) {
    case 1:
      return statistics();
      break;
    case 2:
      return statisticsTwo();

      break;
    default:
      return statistics();

  }
}

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
        counter: 1,
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
      },
      {
        kind: "Node",
        apiVersion: "v1",
        metadata: {
          selfLink: "/api/v1/node",
          resourceVersion: "326"
        },
        id: "67896",
        name: "192.168.1.101",
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
          resourceVersion: "327"
        },
        id: "67897",
        name: "192.168.1.101",
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
          resourceVersion: "328"
        },
        id: "67898",
        name: "192.168.1.101",
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
          resourceVersion: "329"
        },
        id: "67899",
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

function statisticsTwo() {
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

var mockjsonAssembly = function() {
  return {
    kind: "AssemblyList",
    apiVersion: "v1",
    metadata: {
      selfLink: "/api/v1/assemblys",
      resourceVersion: "325"
    },
    id: "12345",
    items: findAssembly(Math.floor(Math.random() * 3) + 1 ),
    // items: findAssembly(1),
  };
};

var findAssembly = function(which) {
  switch (which) {
    case 1:
      return assemblys();
      break;
    case 2:
      return assemblysTwo();

      break;
    case 3:
      return assemblysThree();

      break;
    default:
      return assemblys();

  }
}

var findAssemblyStatus = function(which) {
  switch (which) {
    case 1:
      return "Running";
      break;
    case 2:
      return "Initializing";

      break;
    case 3:
      return "Pending";

      break;
    // case 4:
    //   return "Test";
    //
    //   break;
    default:
      return "Running";

  }
}

var assemblys = function() {

  return [{
      id: "878113037117038592",
      type_meta: {
        kind: "Assembly",
        api_version: "v1"
      },
      kind: "Assembly",
      type: "Assembly",
      object_meta: {
        name: "levi1",
        // name:Math.random(),
        account: "876624987807555584",
        created_at: "2017-12-22T12:23:42.244646102+00:00",
        owner_references: [{
          kind: "AssemblyFactory",
          api_version: "v1",
          name: "levi.megam.io",
        }],
      },
      status: {
        phase: findAssemblyStatus(Math.floor(Math.random() * 3) + 1)
      },
      spec: {
        assembly_factory: {
          id: "87543211234567876",
          created_at: "2017-12-11T11:29:50.547529+00:00",
          object_meta: {
            name: "levi.megam.io",
            account: "870109412813971456",
            created_at: "2017-12-11T11:29:50.547529+00:00",
            cluster_name: "Chennai",
            labels: {
              rioos_environment: "development",
              rioos_category: "machine"
            }
          },
          replicas: 5,
          resources: {
            compute_type: "cpu",
            storage_type: "hdd"
          },
          secret: {
            id: "87665544332234"
          },
          plan: "8989876543344556",
          status: {
            phase: "ready"
          }
        },
        plan_data: {
          object_meta: {
            name: "ubuntu",
          },
          category: "os",
          version: "14.0"
        },
        metrics: {
          name: "gauge3",
          counter: getRandomInt(10, 100),
        },
        endpoints: {
          subsets: {
            addresses: [{
              name: "private",
              ip: "192.168.1.11",
              protocol_version: "ipv4"
            }],
          },
        }
      }
    },

    //second
    {
      id: "878113037117038593",
      type_meta: {
        kind: "Assemblys",
        api_version: "v1"
      },
      object_meta: {
        name: "leviTwo",
        account: "876624987807555584",
        created_at: "2017-12-22T12:23:42.244646102+00:00",
        owner_references: [{
          kind: "AssemblyFactory",
          api_version: "v1",
          name: "leviTwo",
        }],
      },
      status: {
        phase: "Running"
      },

      kind: "Assembly",
      type: "Assembly",
      spec: {
        assembly_factory: {
          id: "87543211234567876",
          created_at: "2017-12-11T11:29:50.547529+00:00",
          object_meta: {
            name: "levi.megam.io",
            account: "870109412813971456",
            created_at: "2017-12-11T11:29:50.547529+00:00",
            cluster_name: "NewYork",
            labels: {
              rioos_environment: "development",
              rioos_category: "machine"
            }
          },
          replicas: 5,
          resources: {
            compute_type: "cpu",
            storage_type: "hdd"
          },
          secret: {
            id: "87665544332234"
          },
          plan: "8989876543344556",
          status: {
            phase: "ready"
          }
        },
        plan_data: {
          object_meta: {
            name: "fedora",
          },
          category: "os",
          version: "5.0.2"


        },
        metrics: {
          name: "gauge4",
          counter: getRandomInt(10, 100),
        },
        endpoints: {
          subsets: {
            addresses: [{
              name: "private",
              ip: "192.168.1.11",
              protocol_version: "ipv4"
            }],
          },
        }
      }
    },

    //third

    {
      id: "878113037117038594",
      type_meta: {
        kind: "Assemblys",
        api_version: "v1"
      },
      object_meta: {
        name: "leviThree",
        account: "876624987807555584",
        created_at: "2017-12-22T12:23:42.244646102+00:00",
        owner_references: [{
          kind: "AssemblyFactory",
          api_version: "v1",
          name: "levi.megam.io",
        }],
      },
      status: {
        phase: "Pending"
      },

      kind: "Assembly",
      type: "Assembly",
      spec: {
        assembly_factory: {
          id: "87543211234567876",
          created_at: "2017-12-11T11:29:50.547529+00:00",
          object_meta: {
            name: "levi.megam.io",
            account: "870109412813971456",
            created_at: "2017-12-11T11:29:50.547529+00:00",
            cluster_name: "Chennai",
            labels: {
              rioos_environment: "development",
              rioos_category: "machine"
            }
          },
          replicas: 5,
          resources: {
            compute_type: "cpu",
            storage_type: "hdd"
          },
          secret: {
            id: "87665544332234"
          },
          plan: "8989876543344556",
          status: {
            phase: "ready"
          }
        },
        plan_data: {
          object_meta: {
            name: "ubuntu",
          },
          category: "os",
          version: "1.1"


        },
        metrics: {
          name: "gauge5",
          counter: getRandomInt(10, 100),
        },
        endpoints: {
          subsets: {
            addresses: [{
              name: "private",
              ip: "192.168.1.11",
              protocol_version: "ipv4"
            }],
          },
        }
      }
    },

    //four

    {
      id: "878113037117038595",
      type_meta: {
        kind: "Assemblys",
        api_version: "v1"
      },
      object_meta: {
        name: "leviFour",
        account: "876624987807555584",
        created_at: "2017-12-22T12:23:42.244646102+00:00",
        owner_references: [{
          kind: "AssemblyFactory",
          api_version: "v1",
          name: "levi.megam.io",
        }],
      },
      status: {
        phase: "Running"
      },

      kind: "Assembly",
      type: "Assembly",
      spec: {
        assembly_factory: {
          id: "87543211234567876",
          created_at: "2017-12-11T11:29:50.547529+00:00",
          object_meta: {
            name: "levi.megam.io",
            account: "870109412813971456",
            created_at: "2017-12-11T11:29:50.547529+00:00",
            cluster_name: "Chennai",
            labels: {
              rioos_environment: "development",
              rioos_category: "machine"
            }
          },
          replicas: 5,
          resources: {
            compute_type: "cpu",
            storage_type: "hdd"
          },
          secret: {
            id: "87665544332234"
          },
          plan: "8989876543344556",
          status: {
            phase: "ready"
          }
        },
        plan_data: {
          object_meta: {
            name: "ubuntu",
          },
          category: "os",
          version: "1.2"

        },
        metrics: {
          name: "gauge6",
          counter: getRandomInt(10, 100),
        },
        endpoints: {
          subsets: {
            addresses: [{
              name: "private",
              ip: "192.168.1.11",
              protocol_version: "ipv4"
            }],
          },
        }
      }
    },
    {
      id: "878113037117038596",
      type_meta: {
        kind: "Assemblys",
        api_version: "v1"
      },
      object_meta: {
        name: "leviFive",
        account: "876624987807555584",
        created_at: "2017-12-22T12:23:42.244646102+00:00",
        owner_references: [{
          kind: "AssemblyFactory",
          api_version: "v1",
          name: "leviTwo",
        }],
      },
      status: {
        phase: "Running"
      },

      kind: "Assembly",
      type: "Assembly",
      spec: {
        assembly_factory: {
          id: "87543211234567876",
          created_at: "2017-12-11T11:29:50.547529+00:00",
          object_meta: {
            name: "levi.megam.io",
            account: "870109412813971456",
            created_at: "2017-12-11T11:29:50.547529+00:00",
            cluster_name: "NewYork",
            labels: {
              rioos_environment: "development",
              rioos_category: "machine"
            }
          },
          replicas: 5,
          resources: {
            compute_type: "cpu",
            storage_type: "hdd"
          },
          secret: {
            id: "87665544332234"
          },
          plan: "8989876543344556",
          status: {
            phase: "ready"
          }
        },
        plan_data: {
          object_meta: {
            name: "debian",
          },
          category: "os",
          version: "0.0.7"


        },
        metrics: {
          name: "gauge7",
          counter: getRandomInt(10, 100),
        },
        endpoints: {
          subsets: {
            addresses: [{
              name: "private",
              ip: "192.168.1.11",
              protocol_version: "ipv4"
            }],
          },
        }
      }
    },
    {
      id: "878113037117038597",
      type_meta: {
        kind: "Assemblys",
        api_version: "v1"
      },
      object_meta: {
        name: "leviSix",
        account: "876624987807555584",
        created_at: "2017-12-22T12:23:42.244646102+00:00",
        owner_references: [{
          kind: "AssemblyFactory",
          api_version: "v1",
          name: "leviTwo",
        }],
      },
      status: {
        phase: "Running"
      },

      kind: "Assembly",
      type: "Assembly",
      spec: {
        assembly_factory: {
          id: "87543211234567876",
          created_at: "2017-12-11T11:29:50.547529+00:00",
          object_meta: {
            name: "levi.megam.io",
            account: "870109412813971456",
            created_at: "2017-12-11T11:29:50.547529+00:00",
            cluster_name: "Chennai",
            labels: {
              rioos_environment: "development",
              rioos_category: "machine"
            }
          },
          replicas: 5,
          resources: {
            compute_type: "cpu",
            storage_type: "hdd"
          },
          secret: {
            id: "87665544332234"
          },
          plan: "8989876543344556",
          status: {
            phase: "ready"
          }
        },
        plan_data: {
          object_meta: {
            name: "debian",
          },
          category: "os",
          version: "0.0.8"


        },
        metrics: {
          name: "gauge8",
          counter: getRandomInt(10, 100),
        },
        endpoints: {
          subsets: {
            addresses: [{
              name: "private",
              ip: "192.168.1.11",
              protocol_version: "ipv4"
            }],
          },
        }
      }
    }
  ]

};

var assemblysTwo = function() {

  return [{
      id: "878113037117038592",
      type_meta: {
        kind: "Assembly",
        api_version: "v1"
      },
      kind: "Assembly",
      type: "Assembly",
      object_meta: {
        name: "levi1",
        // name:Math.random(),
        account: "876624987807555584",
        created_at: "2017-12-22T12:23:42.244646102+00:00",
        owner_references: [{
          kind: "AssemblyFactory",
          api_version: "v1",
          name: "levi.megam.io",
        }],
      },
      status: {
        phase: findAssemblyStatus(Math.floor(Math.random() * 3) + 1)
      },
      spec: {
        assembly_factory: {
          id: "87543211234567876",
          created_at: "2017-12-11T11:29:50.547529+00:00",
          object_meta: {
            name: "levi.megam.io",
            account: "870109412813971456",
            created_at: "2017-12-11T11:29:50.547529+00:00",
            cluster_name: "Chennai",
            labels: {
              rioos_environment: "development",
              rioos_category: "machine"
            }
          },
          replicas: 5,
          resources: {
            compute_type: "cpu",
            storage_type: "hdd"
          },
          secret: {
            id: "87665544332234"
          },
          plan: "8989876543344556",
          status: {
            phase: "ready"
          }
        },
        plan_data: {
          object_meta: {
            name: "ubuntu",
          },
          category: "os",
          version: "14.0"
        },
        metrics: {
          name: "gauge3",
          counter: getRandomInt(10, 100),
        },
        endpoints: {
          subsets: {
            addresses: [{
              name: "private",
              ip: "192.168.1.11",
              protocol_version: "ipv4"
            }],
          },
        }
      }
    },

    //second
    {
      id: "878113037117038593",
      type_meta: {
        kind: "Assemblys",
        api_version: "v1"
      },
      object_meta: {
        name: "leviTwo",
        account: "876624987807555584",
        created_at: "2017-12-22T12:23:42.244646102+00:00",
        owner_references: [{
          kind: "AssemblyFactory",
          api_version: "v1",
          name: "leviTwo",
        }],
      },
      status: {
        phase: "Running"
      },

      kind: "Assembly",
      type: "Assembly",
      spec: {
        assembly_factory: {
          id: "87543211234567876",
          created_at: "2017-12-11T11:29:50.547529+00:00",
          object_meta: {
            name: "levi.megam.io",
            account: "870109412813971456",
            created_at: "2017-12-11T11:29:50.547529+00:00",
            cluster_name: "NewYork",
            labels: {
              rioos_environment: "development",
              rioos_category: "machine"
            }
          },
          replicas: 5,
          resources: {
            compute_type: "cpu",
            storage_type: "hdd"
          },
          secret: {
            id: "87665544332234"
          },
          plan: "8989876543344556",
          status: {
            phase: "ready"
          }
        },
        plan_data: {
          object_meta: {
            name: "fedora",
          },
          category: "os",
          version: "5.0.2"


        },
        metrics: {
          name: "gauge4",
          counter: getRandomInt(10, 100),
        },
        endpoints: {
          subsets: {
            addresses: [{
              name: "private",
              ip: "192.168.1.11",
              protocol_version: "ipv4"
            }],
          },
        }
      }
    },]

};

var assemblysThree = function() {

  return [{
      id: "878113037117038592",
      type_meta: {
        kind: "Assembly",
        api_version: "v1"
      },
      kind: "Assembly",
      type: "Assembly",
      object_meta: {
        name: "levi1",
        // name:Math.random(),
        account: "876624987807555584",
        created_at: "2017-12-22T12:23:42.244646102+00:00",
        owner_references: [{
          kind: "AssemblyFactory",
          api_version: "v1",
          name: "levi.megam.io",
        }],
      },
      status: {
        phase: "Running"
      },
      spec: {
        assembly_factory: {
          id: "87543211234567876",
          created_at: "2017-12-11T11:29:50.547529+00:00",
          object_meta: {
            name: "levi.megam.io",
            account: "870109412813971456",
            created_at: "2017-12-11T11:29:50.547529+00:00",
            cluster_name: "Ooty",
            labels: {
              rioos_environment: "development",
              rioos_category: "machine"
            }
          },
          replicas: 5,
          resources: {
            compute_type: "cpu",
            storage_type: "hdd"
          },
          secret: {
            id: "87665544332234"
          },
          plan: "8989876543344556",
          status: {
            phase: "ready"
          }
        },
        plan_data: {
          object_meta: {
            name: "ubuntu",
          },
          category: "os",
          version: "14.0"
        },
        metrics: {
          name: "gauge3",
          counter: getRandomInt(10, 100),
        },
        endpoints: {
          subsets: {
            addresses: [{
              name: "private",
              ip: "192.168.1.11",
              protocol_version: "ipv4"
            }],
          },
        }
      }
    },

    {
      id: "878113037117038594",
      type_meta: {
        kind: "Assemblys",
        api_version: "v1"
      },
      object_meta: {
        name: "leviThree",
        account: "876624987807555584",
        created_at: "2017-12-22T12:23:42.244646102+00:00",
        owner_references: [{
          kind: "AssemblyFactory",
          api_version: "v1",
          name: "levi.megam.io",
        }],
      },
      status: {
        phase: "Pending"
      },

      kind: "Assembly",
      type: "Assembly",
      spec: {
        assembly_factory: {
          id: "87543211234567876",
          created_at: "2017-12-11T11:29:50.547529+00:00",
          object_meta: {
            name: "levi.megam.io",
            account: "870109412813971456",
            created_at: "2017-12-11T11:29:50.547529+00:00",
            cluster_name: "Chennai",
            labels: {
              rioos_environment: "development",
              rioos_category: "container"
            }
          },
          replicas: 5,
          resources: {
            compute_type: "cpu",
            storage_type: "hdd"
          },
          secret: {
            id: "87665544332234"
          },
          plan: "8989876543344556",
          status: {
            phase: "ready"
          }
        },
        plan_data: {
          object_meta: {
            name: "ubuntu",
          },
          category: "os",
          version: "1.1"


        },
        metrics: {
          name: "gauge5",
          counter: getRandomInt(10, 100),
        },
        endpoints: {
          subsets: {
            addresses: [{
              name: "private",
              ip: "192.168.1.11",
              protocol_version: "ipv4"
            }],
          },
        }
      }
    },
  ]

};
