var C = {

  /* --------  The section  that has  various  http codes  ----*/
  // Stack all the base http codes here
  INTERNALSERVER_ERROR: 500,
  // Conflicts, if there is a record that already exists. Eg: email
  INTERNAL_CONFLICTS:   '409',
  // When the downstream systems are down
  BAD_GATEWAY:          502,

  /* --------  The section  that has  various  http codes  ----*/
  // This is contains the  list of codes that can be  treated as unauthenticated
  // 1. 401 return code when the user isn't authenticated.
  UNAUTHENTICATED_HTTP_CODES: [401],

  // This is contains the  list of codes that can be  treated as unauthorized
  // 1. 403 return code when the user isn't authorized to access an  API
  UNAUTHORIZED_HTTP_CODES: [403],

  // Internal server error
  INTERNALSERVER_HTTP_CODES: ['500'],

  BADGATEWAY_HTTP_CODES: ['502'],


  /* --------  The section  that has  various Rio objects  ----*/

  /* Wizard page sequence steps and activation step default status*/
  WIZARD: {
    // List of steps
    STEPS: {
      WELCOME:       'welcome',
      // Registration page
      REGISTERADMIN: 'register-admin',
      // License activation page
      ACTIVATE:      'activate-license',
    },
    ACTIVATION: {
      PRODUCT: 'RioOS',
      STATUS:  { ACTIVATING: 'activating', }
    },
  },

  /* Account membership and roles*/
  ACCOUNT: {
    MEMBERSHIP: {
      MEMBERSHIPTRAIL:    'Trial',
      MEMBERSHIPSTANDARD: 'Standard',
    },
    MEMBERSHIPSTATUS: {
      MEMBERSHIPSTATUSREGISTERED:   'Registered',
      MEMBERSHIPSTATUSCERTIFICATED: 'Certified',
    },
    ROLES: { SUPERUSER: 'RIOOS:SUPERUSER', },
  },

  /*
  * This section belongs to digital cloud management page.
  * Assembly status and states.
  */
  MANAGEMENT: {
    STATUS: {
      WARNING:   ['bootstrapped', 'pending', 'scheduled', 'initializing', 'initialized', 'bootstrapping', 'booting', 'rebooting', 'starting', 'stopping', 'terminating', 'awaitpending', 'standstill', 'unreachable'],
      SUCCESS:   ['running'],
      FAILURE:   ['stopped', 'failed', 'terminated'],
      TERMINATE: ['terminated', 'terminating'],
    },

    STATE: {
      WARNING: 'warning',
      SUCCESS: 'success',
      FAILURE: 'failure',
    },
  },

  /*
  * Assembly categories
  */
  CATEGORIES: {
    MACHINE:             'machine',
    CONTAINER:           'container',
    BLOCKCHAIN:          'blockchain',
    BLOCKCHAIN_TEMPLATE: 'blockchain_template'
  },

  BLOCKCHAIN: { BLO_FILTER: 'rioos_sh_blockchain_network' },

  /*
  * Assembly resources
  */
  RESOURCES: ['cpu', 'memory', 'disk'],

  /*
  * Digital cloud management page filter query params and key to read data from model.
  */
  FILTERS: {
    UNDERSCORE_DEFAULT:       '_default',
    QUERY_PARAM_OS:           'os',
    QUERY_PARAM_LOCATION:     'location',
    QUERY_PARAM_DB:           'db',
    QUERY_PARAM_NETWORK:      'network',
    QUERY_PARAM_STATUS:       'status',
    QUERY_PARAM_SEARCH:       'search',
    SELECT_OS:                'Select OS',
    SELECT_LOCATION:          'Location',
    SELECT_DB:                'Select DB',
    SELECT_NETWORK:           'Network',
    SELECT_STATUS:            'Status',
    SELECT_OS_ACCESSOR:       'spec.assembly_factory.spec.plan.object_meta.name',
    SELECT_DB_ACCESSOR:       '',
    SELECT_LOCATION_ACCESSOR: 'spec.assembly_factory.object_meta.cluster_name',
    SELECT_NETWORK_ACCESSOR:  '',
    SELECT_STATUS_ACCESSOR:   'status.phase',
    SELECT_NAME_ACCESSOR:     'object_meta.name',
  },

  /*
  * Assembly state.
  */
  ASSEMBLY: {
    ASSEMBLYOFFPHASES: ['stopped', 'failed', 'terminated'],
    ASSEMBLYOFF:       'OFF',
    ASSEMBLYON:        'ON',
    ASSEMBLYIPV4:      'IPv4',
  },

  /*
  * Secrets types of assembly
  */
  SECRETS: {
    KEYS: {
      PUBLIC:  'rioos_sh/ssh_pubkey',
      PRIVATE: 'rioos_sh/ssh_privatekey'
    }
  },

  /*
  * This section belongs to admin infra page. It contains ninja and sensei status, conditions.
  */
  NODE: {
    NINJANODES:                           'ninja_nodes',
    CALMNODES:                            'calm_nodes',
    NINJA_NODES_UNINSTALL_CONDITIONS:     ['MemoryPressure', 'DiskPressure', 'NetworkUnavailable', 'OutOfDisk'],
    NINJA_NODES_RETRY_INSTALL_CONDITIONS: ['InstallComplete', 'Ready'],
    SUBNETSSEARCH:                        [{
      'value': 'Subnet',
      'text':  'Discover the active IP addresses in an IP block (eg: 192.168.2.0/24)'
    }, {
      'value': 'Subnet Range',
      'text':  'Discover the active IP addresses in an given range (eg: 192.168.2.10 - 192.168.2.15)'
    }],
    NODEAUTHTYPE:                         ['Login Credentials', 'SSH Key Verification'],
    INSTALLFAILURE:                       ['NinjaNotReady'],
    NODEUNHEALTHY:                        'down',
    NODEOFF:                              'OFF',
    NODEON:                               'ON',
    STATUS:         {
      INITIAL:  ['initialized', 'pending'],
      READY:    ['ready', 'running', 'ninjaready'],
      NOTREADY: ['notready', 'ninjanotready'],
      RUNNING:  'RUNNING',
      STOPPED:  'STOPPED',
    },
    STORAGE_TYPE:   { CEPH: 'rioos_sh/ceph', },
    LICENSE_STATUS: { EXPIRED: 'Expired', }
  },

  /*
  * IP types of assembly
  */
  IPTYPE: {
    IPV4: 'IPV4',
    IPV6: 'IPV6'
  },

  /*
  * Regex for validating IP, subnet, gateway for both types v4 and v6.
  */
  REGEX: {
    IPV4: {
      IP:      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      NETMASK: /^((128|192|224|240|248|252|254)\.0\.0\.0)|(255\.(((0|128|192|224|240|248|252|254)\.0\.0)|(255\.(((0|128|192|224|240|248|252|254)\.0)|255\.(0|128|192|224|240|248|252|254)))))$/,
      SUBNET:  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/\d+$/,
    },
    IPV6: {
      IP:      /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/,
      NETMASK: /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/,
      SUBNET:      /^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/,
    },
    URI: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.​\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[​6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1​,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00​a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u​00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i,
  },

  PHASE: { READY: 'ready', },

  /*
  * Launch page resource types
  */
  VPS: {
    LOCATION: { DROPDOWNNAME: 'Location' },
    RESOURSE: {
      HDD: 'hdd',
      SSD: 'ssd',
    },
    RESOURSE_COMPUTE_TYPE: {
      CPU: 'cpu',
      GPU: 'gpu',
    }
  },

  /*
  * Rio/Os available network types on launch page
  */
  AVAILABLE_NETWORK_TYPES: ['private_ipv4', 'private_ipv6', 'public_ipv4', 'public_ipv6'],

  STORAGE: { LOCATION: { NOTALLOW: ['[SWAP]', '/'], }, },

  CAPABILITY: {
    NETWORK_POLICIES: 'network-policy-manager',
    SECRETS:          'secrets',
  },

  /*
  * Dashboard network statistics properties
  */
  NETWORK: {
    PACKETMEASURETYPE: {
      // Packet measurement types
      THROUGHPUT: 'throughput',
      ERROR:      'error',
    },
    MEASURETYPES: ['throughput', 'error']
  },

  PROCESS: { TYPE: ['CPU', 'MEMORY'] },

  COOKIE: {
    TOKEN:          'token',
    PL:             'PL',
    PL_RIOOS_VALUE: 'rioos',
    CSRF:           'CSRF',
    LANG:           'LANG',
  },

  // Ephemeral but same but across all browser tabs
  SESSION: {
    BACK_TO:        'backTo',
    // The fields id, token, email, roles, metadata.origin,
    // metadata.team are pulled from successful login response.
    ACCOUNT_ID:     'id',
    TOKEN:          'token',
    EMAIL:          'email',
    USER_ROLES:     'roles',
    // User belongs to origansation (origins) origins have teams.
    ORIGIN:         'metadata.origin',
    TEAM:           'metadata.team',
    // This used for loading the default language for on user
    LANGUAGE:       'language',
  },

  // Ephemeral and unique for each browser tab
  TABSESSION: {
    PROJECT:      'projectId',
    TEAM:         'team',
    ORGANIZATION:     'organization',
    PROJECTDATA:  'projectData',
    NAMESPACE:    'namespaceId',
  },

  /*
  * Headers properties to communicate api_gateway
  */
  HEADER: {
    ACCOUNT_ID:         'X-Api-Account-Id',
    ACTIONS:            'X-Api-Action-Links',
    ACTIONS_VALUE:      'actionLinks',
    CSRF:               'X-Api-Csrf',
    NO_CHALLENGE:       'X-Api-No-Challenge',
    NO_CHALLENGE_VALUE: 'true',
    PROJECT_ID:         'X-Api-Project-Id',
    RIOOS_VERSION:      'X-RioOS-Version',
  },

  KEY: {
    LEFT:      37,
    UP:        38,
    RIGHT:     39,
    DOWN:      40,
    ESCAPE:    27,
    CR:        13,
    LF:        10,
    TAB:       9,
    SPACE:     32,
    PAGE_UP:   33,
    PAGE_DOWN: 34,
    HOME:      35,
    END:       36,
  },

  PREFS: {
    ACCESS_WARNING:  'accessWarning',
    BODY_BACKGROUND: 'bodyBackground',
    TABLE_COUNT:     'tableCount',
    LANGUAGE:        'language',
  },

  /*
  * nilavu language
  */
  LANGUAGE: {
    // Default language set as 'en-us'
    DEFAULT:                 'en-us',
    FORMAT_RELATIVE_TIMEOUT: 1000,
    DOCS:                    ['en'],
  },

  TABLES: { DEFAULT_COUNT: 50 },

  SETTING: {
    // Dots in key names do not mix well with Ember, so use $ in their place.
    DOT_CHAR:                 '$',
    API_HOST:                 'api$host',
    COMPUTE_TYPE:             'ui$digicloud$compute_type',
    DOMAIN:                   'ui$digicloud$domain',
    CPU_CORE:                 'ui$digicloud$cpu',
    RAM:                      'ui$digicloud$ram',
    DISK:                     'ui$digicloud$disk',
    DISK_TYPE:                'ui$digicloud$disk_type',
    OS_NAME:                  'ui$digicloud$os_name',
    OS_VERSION:               'ui$digicloud$os_version',
    SECRET_TYPE_NAMES:        'ui$digicloud$secret_type_names',
    SECRET_TYPE:              'ui$digicloud$secret_type',
    SECRET_KEY_LENGTH:        'ui$digicloud$secret_key_length',
    TRUSTED_KEY:              'ui$digicloud$trusted_key',
  },

  USER: {
    TYPE_NORMAL:  'user',
    TYPE_ADMIN:   'admin',
    BASIC_BEARER: 'x-api-bearer',
  },

  /*
  * Rio external links
  */
  EXT_REFERENCES: {
    FORUM:   'https://forums.rioos.xyz',
    COMPANY: 'http://rio.digital',
    GITHUB:  'https://github.com/riocorp',
    DOCS:    'https://docs.rioos.xyz/rioos',
    SLACK:   'https://riocorpteam.slack.com',
  },

  ANALYTIC_EVENTS: {
    LOGGED_IN:            'Logged_In',
    DEPLOY_DIGITAL_CLOUD: '[Deploy]_Digital_Cloud',
    DELETE_DIGITAL_CLOUD: '[Delete]_Digital_Cloud',
    DEPLOY_CONTAINER:     '[Deploy]_Container',
    DELETE_CONTAINER:     '[Delete]_Container',
  },

};

/*
* Assembly management page filter selector and accessor
*/
C.FILTER_QUERY_PARAMS_ALL = [C.FILTERS.QUERY_PARAM_OS, C.FILTERS.QUERY_PARAM_DB,
  C.FILTERS.QUERY_PARAM_LOCATION, C.FILTERS.QUERY_PARAM_NETWORK, C.FILTERS.QUERY_PARAM_STATUS
];

C.FILTERS_SEARCH_ACCESSORS = [C.FILTERS.SELECT_OS_ACCESSOR, C.FILTERS.SELECT_LOCATION_ACCESSOR, C.FILTERS.SELECT_DB_ACCESSOR, C.FILTERS.SELECT_STATUS_ACCESSOR, C.FILTERS.SELECT_NETWORK_ACCESSOR, C.FILTERS.SELECT_NAME_ACCESSOR],

C.FILTERS.QUERYPARM_TO_ACCESSOR_HASH = [{
  selector: C.FILTERS.QUERY_PARAM_OS,
  accessor: C.FILTERS.SELECT_OS_ACCESSOR,
  _default: C.FILTERS.SELECT_OS
},
{
  selector: C.FILTERS.QUERY_PARAM_LOCATION,
  accessor: C.FILTERS.SELECT_LOCATION_ACCESSOR,
  _default: C.FILTERS.SELECT_LOCATION
},
{
  selector: C.FILTERS.QUERY_PARAM_DB,
  accessor: C.FILTERS.SELECT_DB_ACCESSOR,
  _default: C.FILTERS.SELECT_DB
},
{
  selector: C.FILTERS.QUERY_PARAM_STATUS,
  accessor: C.FILTERS.SELECT_STATUS_ACCESSOR,
  _default: C.FILTERS.SELECT_STATUS
},
{
  selector: C.FILTERS.QUERY_PARAM_NETWORK,
  accessor: C.FILTERS.SELECT_NETWORK_ACCESSOR,
  _default: C.FILTERS.SELECT_NETWORK
},
{
  selector: C.FILTERS.QUERY_PARAM_SEARCH,
  accessor: C.FILTERS_SEARCH_ACCESSORS
},
];

//  Assembly management page tabs
C.CATEGORIES_ALL = [C.CATEGORIES.MACHINE, C.CATEGORIES.CONTAINER];

//  Areas which are focusing events.
C.ANALYTIC_EVENTS_ALL = [
  C.ANALYTIC_EVENTS.LOGGED_IN,
  C.ANALYTIC_EVENTS.DEPLOY_DIGITAL_CLOUD,
  C.ANALYTIC_EVENTS.DELETE_DIGITAL_CLOUD,
  C.ANALYTIC_EVENTS.DEPLOY_CONTAINER,
  C.ANALYTIC_EVENTS.DELETE_CONTAINER,
];

//  Keys that are going to store on session when the user loggedin or signedup
C.TOKEN_TO_SESSION_KEYS = [
  C.SESSION.ACCOUNT_ID,
  C.SESSION.EMAIL,
  C.SESSION.TOKEN,
  C.SESSION.USER_ROLES,
];

//  Initial state of assembly
C.INITIALIZING_STATES = [
  'initializing',
  'reinitializing'
];

export default C;
