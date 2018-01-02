import Component from '@ember/component';
import DefaultFilter from 'nilavu/models/default-filter';

export default Component.extend({
  tagName: '',
  isSearchVisible: false,
  theFilter: "",
  selectedFilter: DefaultFilter.selectableType(),
  defaultFilter: DefaultFilter.defaultFilter(),

  assemblyLength: function() {
    return this.get('assemblys').length;
  }.property('model'),

  assemblyUpdated: function() {
    this.uniquefilteredAssembly();
  }.observes('assemblys'),

  filterData: function() {
    return DefaultFilter.defaultFilter();
  }.property('filterData'),

  didInsertElement: function() {
    this.uniquefilteredAssembly();
  },

  // checkFilterMatch: function(theObject, str) {
  //   var field, match;
  //   match = false;
  //   for (field in theObject) {
  //     if (!theObject[field] == null) {
  //     if (JSON.stringify(theObject[field]).toString().slice(0, str.length) === str) {
  //       match = true;
  //     }
  //   }
  //   }
  //   return match;
  // },
  //
  // filterAssembly: (function() {
  //   return this.get("assemblys").filter((function(_this) {
  //     return function(theObject, index, enumerable) {
  //       if (_this.get("theFilter")) {
  //         return _this.checkFilterMatch(theObject, _this.get("theFilter"));
  //       } else {
  //         return true;
  //       }
  //     };
  //   })(this));
  // }).property("theFilter", "assemblys"),

  filteredAssembly(assemblys, path, key) {
    return assemblys.filterBy(path, key);
  },

  uniquefilteredAssembly: function() {
    var filterUpdatedAssemblysData;

    this.get('selectedFilter').forEach(function(item) {
      // for (var i = 0; i < this.get('selectedFilter').length; i++) {
      if (!item.value == "" && filterUpdatedAssemblysData == undefined) {

        filterUpdatedAssemblysData = this.filteredAssembly(this.get('assemblys'), item.path, item.value)
        this.set('filteredAssemblys', filterUpdatedAssemblysData);

      } else if (!item.value == "") {
        filterUpdatedAssemblysData = this.filteredAssembly(filterUpdatedAssemblysData, item.path, item.value)
        this.set('filteredAssemblys', filterUpdatedAssemblysData);

      } else if (filterUpdatedAssemblysData == undefined) { //(arr.length - 1) condition would be fine
        this.set('filteredAssemblys', this.get('assemblys'));
      }
    }.bind(this));
    // };
  },

  filterProperties: function() {
    return this.fillDataForFilterProperties();
  }.property('defaultfilterss'),


  fillDataForFilterProperties: function() {
    this.set('defaultfilterss.a.data', this.filterUniqueDataFromAssembly(this.get('defaultfilterss.a')));
    return this.get('defaultfilterss');
  },

  filterUniqueDataFromAssembly: function(filter) {
    var filtered = [];
    this.get('assemblys').forEach(function(assembly) {
      // var b = assembly['plan_data']['object_meta']['name'];
      // alert(JSON.stringify(this.findNestedKey(assembly, 'name')));
      filtered.pushObject(assembly[filter.path]);
    }.bind(this));
    return [...new Set(filtered)];
  },


  filterFromAssemblys: function() {
    var location = [];
    var os = [];
    var status = [];
    this.get('defaultFilter').forEach(function(filter) {
      this.get('assemblys').forEach(function(assembly) {
        switch (filter.id) {
          case 'selectOs':
            os.pushObject(assembly.spec.plan_data.object_meta.name)
            break;
          case 'selectLocation':
            location.pushObject(assembly.spec.assembly_factory.object_meta.cluster_name)
            break;
          case 'selectStatus':
            status.pushObject(assembly.status.phase)
            break;
        }
      });
      if (filter.id == 'selectOs') {
        filter.data = [...new Set(os)];
      }
      if (filter.id == 'selectLocation') {
        filter.data = [...new Set(location)];
      }
      if (filter.id == 'selectStatus') {
        filter.data = [...new Set(status)];
      }
    }.bind(this));
    // this.set('model.filter',this.get('defaultFilter'));
    return this.get('defaultFilter');
  },


  actions: {

    search() {
      this.toggleProperty('isSearchVisible');
    },

    filterProcess(selectedItem) {
      this.get('selectedFilter').forEach(function(item) {
        if (selectedItem.type === item.key) {
          item.value = selectedItem.selected;
        }
      });
      this.uniquefilteredAssembly();
    }
  }

});
