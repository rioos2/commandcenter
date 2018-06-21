var C = {

  ASSEMBLY: {
    ASSEMBLYOFFPHASES: ["stopped", "failed", "terminated"],
    ASSEMBLYOFF: "OFF",
    ASSEMBLYON: "ON",
    ASSEMBLYIPV4: "IPv4",
  },

  NODE: {
    NINJANODES: "ninja_nodes",
    CALMNODES: "calm_nodes",
    NINJANODESCONDITIONS: ["MemoryPressure", "DiskPressure", "NetworkUnavailable", "OutOfDisk"],
    SUBNETSSEARCH: ["Default", "Subnet", "Subnet Range"],
    NODEAUTHTYPE: ["Password", "SSH"]
  },

  IPTYPE: {
    IPV4: "IPV4",
    IPV6: "IPV6"
  },

  ACCOUNT: {
    MEMBERSHIP: {
      MEMBERSHIPTRAIL: "Trail",
      MEMBERSHIPSTANDARD: "Standard",
    },
    MEMBERSHIPSTATUS: {
      MEMBERSHIPSTATUSREGISTERED: "Registered",
      MEMBERSHIPSTATUSCERTIFICATED: "Certificated",
    },
  },

  REGEX: {
    IPV4: {
      IP: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      NETMASK: /^((128|192|224|240|248|252|254)\.0\.0\.0)|(255\.(((0|128|192|224|240|248|252|254)\.0\.0)|(255\.(((0|128|192|224|240|248|252|254)\.0)|255\.(0|128|192|224|240|248|252|254)))))$/,
      SUBNET: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/\d+$/,
    },
    IPV6: {
      IP: /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/,
      NETMASK: /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/,
      SUBNET: /^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/,
    },
    URI: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.​\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[​6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1​,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00​a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u​00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i,
  },

  PHASE: {
    READY: "ready",
  },

  VPS: {
    LOCATION: {
      DROPDOWNNAME: "Location"
    },
    RESOURSE: {
      HDD: "hdd",
      SSD: "ssd",
    },
    RESOURSE_COMPUTE_TYPE: {
      CPU: "cpu",
      GPU: "gpu",
    }
  },

  MANAGEMENT: {
    STATUS: {
      WARNING: ["bootstrapped", "pending", "scheduled", "initializing", "initialized", "bootstrapping", "booting", "rebooting", "starting", "stopping", "terminating"],
      SUCCESS: ["running"],
      FAILURE: ["stopped", "failed", "terminated"],
      TERMINATE: ["terminated", "terminating"],
    },

    STATE: {
      WARNING: "warning",
      SUCCESS: "success",
      FAILURE: "failure",
    },
  },

  ADMIN: {
    STATUS: {
      INITIAL: ["initialized", "pending"],
      READY: ["ready", "running"],
      NOTREADY: ["notready"],
    },
    STORAGE_TYPE: {
      CEPH: "rioos_sh/ceph",
    },
  },

  AVAILABLE_NETWORK_TYPES: ["private_ipv4", "private_ipv6", "public_ipv4", "public_ipv6"],

  STORAGE: {
    LOCATION: {
      NOTALLOW: ["[SWAP]", "/"],
    },
  },

  CAPABILITY: {
    NETWORK_POLICIES: 'network-policy-manager',
    SECRETS: 'secrets',
  },

  COOKIE: {
    TOKEN: 'token',
    PL: 'PL',
    PL_RIOOS_VALUE: 'rioos',
    CSRF: 'CSRF',
    LANG: 'LANG',
  },

  NETWORK: {
    PACKETMEASURETYPE: {
      THROUGHPUT: 'throughput',
      ERROR: 'error',
    },
    MEASURETYPES: ["throughput", "error"]
  },

  PROCESS: {
    TYPE: ['CPU', 'MEMORY']
  },

  CATALOG: {
    LIBRARY_KEY: 'library',
    LIBRARY_VALUE: 'https://git.rancher.io/rancher-catalog.git',
    COMMUNITY_KEY: 'community',
    COMMUNITY_VALUE: 'https://git.rancher.io/community-catalog.git',
    DEFAULT_BRANCH: 'master',
  },


  HEADER: {
    ACCOUNT_ID: 'X-Api-Account-Id',
    ACTIONS: 'X-Api-Action-Links',
    ACTIONS_VALUE: 'actionLinks',
    CSRF: 'X-Api-Csrf',
    NO_CHALLENGE: 'X-Api-No-Challenge',
    NO_CHALLENGE_VALUE: 'true',
    PROJECT_ID: 'X-Api-Project-Id',
    RIOOS_VERSION: 'X-RioOS-Version',
  },

  KEY: {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    ESCAPE: 27,
    CR: 13,
    LF: 10,
    TAB: 9,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    HOME: 35,
    END: 36,
  },

  PREFS: {
    ACCESS_WARNING: 'accessWarning',
    BODY_BACKGROUND: 'bodyBackground',
    PROJECT_DEFAULT: 'defaultProjectId',
    EXPANDED_STACKS: 'expandedStacks',
    SORT_STACKS_BY: 'sortStacksBy',
    THEME: 'theme',
    TABLE_COUNT: 'tableCount',
    LANGUAGE: 'language',
    I_HATE_SPINNERS: 'ihatespinners',
    FEEDBACK: 'feedback',
    SHOW_SYSTEM: 'showSystem',
  },

  LANGUAGE: {
    DEFAULT: 'en-us',
    FORMAT_RELATIVE_TIMEOUT: 1000,
    DOCS: ['en'],
  },

  TABLES: {
    DEFAULT_COUNT: 50

  },

  PROJECT: {
    TYPE_RANCHER: 'rancher_id',
    TYPE_AZURE_USER: 'azuread_user',
    TYPE_AZURE_GROUP: 'azuread_group',
    TYPE_GITHUB_USER: 'github_user',
    TYPE_GITHUB_TEAM: 'github_team',
    TYPE_GITHUB_ORG: 'github_org',
    TYPE_LDAP_USER: 'ldap_user',
    TYPE_LDAP_GROUP: 'ldap_group',
    TYPE_OPENLDAP_USER: 'openldap_user',
    TYPE_OPENLDAP_GROUP: 'openldap_group',
    TYPE_SHIBBOLETH_USER: 'shibboleth_user',
    TYPE_SHIBBOLETH_GROUP: 'shibboleth_group',

    PERSON: 'person',
    TEAM: 'team',
    ORG: 'org',

    ROLE_MEMBER: 'member',
    ROLE_OWNER: 'owner',

    SUPPORTS_NETWORK_POLICY: [
      'ipsec',
      'vxlan',
    ]
  },

  // Ephemeral but same but across all browser tabs
  SESSION: {
    BACK_TO: 'backTo',
    USER_ID: 'user',
    ACCOUNT_ID: 'id',
    TOKEN: 'token',
    EMAIL: 'email',
    USER_TYPE: 'userType',
    PROJECT: 'projectId',
    IDENTITY: 'userIdentity',
    IDENTITY_TYPE: 'userType',
    LANGUAGE: 'language',
    LOGIN_LANGUAGE: 'loginLanguage',
  },

  // Ephemeral and unique for each browser tab
  TABSESSION: {
    PROJECT: 'projectId',
    PROJECTDATA: 'projectData',
    NAMESPACE: 'namespaceId',
  },

  SETTING: {
    // Dots in key names do not mix well with Ember, so use $ in their place.
    DOT_CHAR: '$',
    IMAGE_RANCHER: 'rancher$server$image',
    VERSION_RANCHER: 'rancher$server$version',
    VERSION_COMPOSE: 'rancher$compose$version',
    VERSION_CLI: 'rancher$cli$version',
    VERSION_CATTLE: 'cattle$version',
    VERSION_MACHINE: 'docker$machine$version',
    VERSION_GMS: 'go$machine$service$version',
    CLI_URL: {
      DARWIN: 'rancher$cli$darwin$url',
      WINDOWS: 'rancher$cli$windows$url',
      LINUX: 'rancher$cli$linux$url',
    },
    COMPOSE_URL: {
      DARWIN: 'rancher$compose$darwin$url',
      WINDOWS: 'rancher$compose$windows$url',
      LINUX: 'rancher$compose$linux$url',
    },
    API_HOST: 'api$host',
    CATALOG_URL: 'catalog$url',
    SWARM_PORT: 'swarm$tls$port',
    ENGINE_URL: 'engine$install$url',
    SUPPORTED_DOCKER: 'supported$docker$range',
    NEWEST_DOCKER: 'newest$docker$version',
    TELEMETRY: 'telemetry$opt',
    AUTH_LOCAL_VALIDATE_DESC: 'api$auth$local$validate$description',
    BALANCER_IMAGE: 'lb$instance$image',
    PROJECT_VERSION: 'account$version',
    FEEDBACK_FORM: 'ui$feedback$form',
    COMPUTE_TYPE: 'ui$digicloud$compute_type',
    DOMAIN: 'ui$digicloud$domain',
    CPU_CORE: 'ui$digicloud$cpu',
    RAM: 'ui$digicloud$ram',
    DISK: 'ui$digicloud$disk',
    DISK_TYPE: 'ui$digicloud$disk_type',
    OS_NAME: 'ui$digicloud$os_name',
    OS_VERSION: 'ui$digicloud$os_version',
    SECRET_TYPE_NAMES: 'ui$digicloud$secret_type_names',
    SECRET_TYPE: 'ui$digicloud$secret_type',
    SECRET_KEY_LENGTH: 'ui$digicloud$secret_key_length',
    TRUSTED_KEY: 'ui$digicloud$trusted_key',
  },

  USER: {
    TYPE_NORMAL: 'user',
    TYPE_ADMIN: 'admin',
    BASIC_BEARER: 'x-api-bearer',
  },

  AUTH_TYPES: {
    AdminAuth: 'None',
    BasicAuth: 'API Key',
    HeaderAuth: 'HeaderAuth',
    RegistrationToken: 'Host Registration',
    TokenAccount: 'TokenAccount',
    TokenAuth: 'UI Session'
  },

  EXT_REFERENCES: {
    FORUM: 'https://forums.rioos.xyz',
    COMPANY: 'http://rio.digital',
    GITHUB: 'https://github.com/riocorp',
    DOCS: 'https://docs.rioos.xyz/rioos',
    SLACK: 'https://riocorpteam.slack.com',
  },

  CATEGORIES: {
    MACHINE: 'machine',
    CONTAINER: 'container',
    BLOCKCHAIN: 'blockchain',
    BLOCKCHAIN_TEMPLATE: 'blockchain_template'
  },

  BLOCKCHAIN: {
    BLO_FILTER: 'rioos_sh_blockchain_network'
  },

  FILTERS: {
    UNDERSCORE_DEFAULT: "_default",
    QUERY_PARAM_OS: "os",
    QUERY_PARAM_LOCATION: "location",
    QUERY_PARAM_DB: "db",
    QUERY_PARAM_NETWORK: "network",
    QUERY_PARAM_STATUS: "status",
    QUERY_PARAM_SEARCH: "search",
    SELECT_OS: "Select OS",
    SELECT_LOCATION: "Location",
    SELECT_DB: "Select DB",
    SELECT_NETWORK: "Network",
    SELECT_STATUS: "Status",
    SELECT_OS_ACCESSOR: "spec.assembly_factory.spec.plan.object_meta.name",
    SELECT_DB_ACCESSOR: "",
    SELECT_LOCATION_ACCESSOR: "spec.assembly_factory.object_meta.cluster_name",
    SELECT_NETWORK_ACCESSOR: "",
    SELECT_STATUS_ACCESSOR: "status.phase",
    SELECT_NAME_ACCESSOR: "object_meta.name",
  },

  ANALYTIC_EVENTS: {
    LOGGED_IN: "Logged_In",
    DEPLOY_DIGITAL_CLOUD: "[Deploy]_Digital_Cloud",
    DELETE_DIGITAL_CLOUD: "[Delete]_Digital_Cloud",
    DEPLOY_CONTAINER: "[Deploy]_Container",
    DELETE_CONTAINER: "[Delete]_Container",
  },

};

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

C.CATEGORIES_ALL = [C.CATEGORIES.MACHINE, C.CATEGORIES.CONTAINER, C.CATEGORIES.BLOCKCHAIN];

C.ANALYTIC_EVENTS_ALL = [
  C.ANALYTIC_EVENTS.LOGGED_IN,
  C.ANALYTIC_EVENTS.DEPLOY_DIGITAL_CLOUD,
  C.ANALYTIC_EVENTS.DELETE_DIGITAL_CLOUD,
  C.ANALYTIC_EVENTS.DEPLOY_CONTAINER,
  C.ANALYTIC_EVENTS.DELETE_CONTAINER,
];

C.TOKEN_TO_SESSION_KEYS = [
  C.SESSION.ACCOUNT_ID,
  C.SESSION.EMAIL,
  C.SESSION.TOKEN,
  C.SESSION.USER_ID,
  C.SESSION.USER_TYPE,
  C.SESSION.IDENTITY,
  C.SESSION.IDENTITY_TYPE
];

C.INITIALIZING_STATES = [
  'initializing',
  'reinitializing'
];

export default C;
