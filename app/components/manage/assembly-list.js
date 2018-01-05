import Component from '@ember/component';
import DefaultFilter from 'nilavu/models/default-filter';
import jsonFinder from 'npm:flat';

export default Component.extend({
  tagName: '',
  isSearchVisible: false,
  theFilter: "",
  defaultFilter: DefaultFilter.defaultFilter(),

  assemblyLength: function() {
    return this.get('assemblys').length;
  }.property('model'),

  selectedFilter: function() {
    return DefaultFilter.selectableType(this.get('assemblyType'));
  }.property('model'),

  assemblyUpdated: function() {
    this.uniquefilteredAssembly();
    this.set('assemblyLength', this.get('assemblys').length);
    this.set('filterProperties', this.fillDataForFilterProperties());
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
  }.property('defaultfilters'),

 //Here these data has to be updated when ever assemblys get updated. And new assembly's comes.
  fillDataForFilterProperties: function() {
    this.set('defaultfilters.a.data', this.filterUniqueDataFromAssembly(this.get('defaultfilters.a')));
    this.set('defaultfilters.b.data', this.filterUniqueDataFromAssembly(this.get('defaultfilters.b')));
    this.set('defaultfilters.c.data', this.filterUniqueDataFromAssembly(this.get('defaultfilters.c')));
    this.set('defaultfilters.d.data', this.filterUniqueDataFromAssembly(this.get('defaultfilters.d')));
    this.set('defaultfilters.e.data', this.filterUniqueDataFromAssembly(this.get('defaultfilters.e')));
    return this.get('defaultfilters');
  },

  filterUniqueDataFromAssembly: function(filter) {
    var filtered = [];
    this.get('assemblys').forEach(function(assembly) {
      var result = jsonFinder(assembly)[filter.path];
      if (result !== undefined) {
        filtered.pushObject(result);
      }
    }.bind(this));
    return [...new Set(filtered)];
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
  },

});
