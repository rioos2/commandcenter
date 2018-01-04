const DefaultFilter = Ember.Object.extend({});

DefaultFilter.reopenClass({

  defaultFilter() {

    var filter = [{
      id: "selectOs",
      name: "select os",
      data: [],
    }, {
      id: "selectDb",
      name: "select db",
      data: [],
    }, {
      id: "selectLocation",
      name: "location",
      data: [],
    }, {
      id: "selectNetwork",
      name: "network",
      data: [],
    }, {
      id: "selectStatus",
      name: "status",
      data: [],
    }];
    return filter;
  },

  defaultFiltersContainer() {

    var filter = {
      a: {
        id: "selectOs",
        name: "Select OS",
        path: "spec.plan_data.object_meta.name",
        data: [],
      },
      b: {
        id: "selectDb",
        name: "Select DB",
        path: "",
        data: [],
      },
      c: {
        id: "selectLocation",
        name: "Location",
        path: "spec.assembly_factory.object_meta.cluster_name",
        data: [],
      },
      d: {
        id: "selectNetwork",
        name: "Network",
        path: "",
        data: [],
      },
      e: {
        id: "selectStatus",
        name: "Status",
        path: "status.phase",
        data: [],
      },
    };

  return filter;
},

defaultFiltersMachine() {

  var filter = {
    a: {
      id: "selectOs",
      name: "Select OS",
      path: "spec.plan_data.object_meta.name",
      data: [""],
    },
    b: {
      id: "selectDb",
      name: "Select DB",
      path: "",
      data: [""],
    },
    c: {
      id: "selectLocation",
      name: "Location",
      path: "spec.assembly_factory.object_meta.cluster_name",
      data: [""],
    },
    d: {
      id: "selectNetwork",
      name: "Network",
      path: "",
      data: [],
    },
    e: {
      id: "selectStatus",
      name: "Status",
      path: "status.phase",
      data: [],
    },
  };

return filter;
},

defaultFiltersBlockChain() {

  var filter = {
    a: {
      id: "selectOs",
      name: "Select OS",
      path: "spec.plan_data.object_meta.name",
      data: [""],
    },
    b: {
      id: "selectDb",
      name: "Select DB",
      path: "",
      data: [""],
    },
    c: {
      id: "selectLocation",
      name: "Location",
      path: "spec.assembly_factory.object_meta.cluster_name",
      data: [""],
    },
    d: {
      id: "selectNetwork",
      name: "Network",
      path: "",
      data: [],
    },
    e: {
      id: "selectStatus",
      name: "Status",
      path: "status.phase",
      data: [],
    },
  };

return filter;
},

selectableType(type) {
  switch (type) {
    case "machine":
      return this.selectableTypeMachine();
      break;
    case "container":
      return this.selectableTypeContainer();
      break;
    case "blockchain":
      return this.selectableTypeBlockchain();
      break;
    default:
      return this.selectableTypeMachine();

  }
},

selectableTypeMachine() {
  var selectableType = [{
    'key': 'selectOs',
    'value': '',
    'path': 'spec.plan_data.object_meta.name',
  }, {
    'key': 'selectLocation',
    'value': '',
    'path': 'spec.assembly_factory.object_meta.cluster_name',
  }, {
    'key': 'selectNetwork',
    'value': '',
    'path': '',
  }, {
    'key': 'selectStatus',
    'value': '',
    'path': 'status.phase',
  }, {
    'key': 'selectDb',
    'value': '',
    'path': '',
  }];
  return selectableType;
},

selectableTypeContainer() {
  var selectableType = [{
    'key': 'selectOs',
    'value': '',
    'path': 'spec.plan_data.object_meta.name',
  }, {
    'key': 'selectLocation',
    'value': '',
    'path': 'spec.assembly_factory.object_meta.cluster_name',
  }, {
    'key': 'selectNetwork',
    'value': '',
    'path': '',
  }, {
    'key': 'selectStatus',
    'value': '',
    'path': 'status.phase',
  }, {
    'key': 'selectDb',
    'value': '',
    'path': '',
  }];
  return selectableType;
},

selectableTypeBlockchain() {
  var selectableType = [{
    'key': 'selectOs',
    'value': '',
    'path': 'spec.plan_data.object_meta.name',
  }, {
    'key': 'selectLocation',
    'value': '',
    'path': 'spec.assembly_factory.object_meta.cluster_name',
  }, {
    'key': 'selectNetwork',
    'value': '',
    'path': '',
  }, {
    'key': 'selectStatus',
    'value': '',
    'path': 'status.phase',
  }, {
    'key': 'selectDb',
    'value': '',
    'path': '',
  }];
  return selectableType;
},

});
export default DefaultFilter;
