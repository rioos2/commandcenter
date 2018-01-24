import Component from '@ember/component';
import DefaultFilter from 'nilavu/models/default-filter';
import jsonFinder from 'npm:flat';

export default Component.extend({
  tagName: '',
  isSearchVisible: false,
  theFilter: "",
  defaultFilter: DefaultFilter.defaultFilter(),
  defaultFiltersMachine: DefaultFilter.defaultFiltersMachine(),

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

  checkFilterMatch: function(theObject, str) {

    var field, match;
    match = false;
    for (field in theObject) {
      if (!(theObject[field] == null)) {
      if (theObject[field].toString().slice(0, str.length) == str) {
        match = true;
        break;
      }
     }
    }
    return match;
  },

  filterAssembly: (function() {
    if (this.get("theFilter").length > 2) {
      let filteredSearchAssemblys = this.get("assemblys").filter((function(_this) {
        return function(theObject, index, enumerable) {
          if (_this.get("theFilter")) {
            return _this.checkFilterMatch(jsonFinder(theObject), _this.get("theFilter"));
          } else {
            return true;
          }
        };
      })(this));
      if (filteredSearchAssemblys.length > 0) {
        this.set('filteredAssemblys',filteredSearchAssemblys);
      }
    } else {
      this.uniquefilteredAssembly();
    }
  }).observes("theFilter"),

  filteredAssembly(assemblys, path, key) {
    return assemblys.filterBy(path, key);
  },

  resetFilterName: function() {
    this.freeSelectedFilter();
    this.set('defaultfilters.a.name', this.get('defaultFiltersMachine.a.name'));
    this.set('defaultfilters.b.name', this.get('defaultFiltersMachine.b.name'));
    this.set('defaultfilters.c.name', this.get('defaultFiltersMachine.c.name'));
    this.set('defaultfilters.d.name', this.get('defaultFiltersMachine.d.name'));
    this.set('defaultfilters.e.name', this.get('defaultFiltersMachine.e.name'));
    return this.get('defaultfilters');
  },

  freeSelectedFilter: function() {
    this.get('selectedFilter').forEach(item => {
      item.value = "";
    })
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
      this.set('theFilter','');
      this.send('filterReset');
    },

    filterReset() {
      this.get('filterProperties', this.resetFilterName());
      this.set('filteredAssemblys', this.get('assemblys'));
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
