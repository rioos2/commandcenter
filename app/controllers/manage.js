import Controller from '@ember/controller';
import DefaultFilter from 'nilavu/models/default-filter';

export default Controller.extend({
  isSearchVisible: false,
  cacheAssemblys: [],
  container: 'container',
  machine: 'machine',
  blockchain: 'blockchain',

  assemblyLength: function() {
    return this.get('cacheAssemblys').length;
  }.property('model'),

  modelchanged: function() {
    if (this.get('model.content')) {
      this._addCache();
      // this._removeCache();
      this._removeCacheAssemblys();
      this.set('machineAssemblys', this.filterAssembly("machine"));
      this.set('containerAssemblys', this.filterAssembly("container"));
      this.set('blockChainAssemblys', this.filterAssembly("blockchain"));
    }
  }.observes('model'),

  _addCache: function() {
    var assemblys = null;
    const self = this;
    assemblys = self.get('model.content');
    assemblys.forEach(function(assembly) {
      if (self._hasAddRecordFor(assembly)) {
        self.get('cacheAssemblys').addObject(assembly);
      }
    });
    return this.get('cacheAssemblys');
  },

  _removeCache: function() {
    const self = this;
    self.get('cacheAssemblys').forEach(function(assembly) { //here we just removing index value when we remove some object. So it'll collapsed when @each
      if (self._hasRemoveRecordFor(assembly)) {
        self.get('cacheAssemblys').removeObject(assembly);
      }
    });
  },

  _hasAddRecordFor: function(assembly) {
    var flag = true;
    const self = this;
    self.get('cacheAssemblys').forEach(function(cache) {
      if (cache.id === assembly.id) {
        flag = false;
      }
    });
    return flag;
  },

  _hasRemoveRecordFor: function(cache) {
    var assemblys = null;
    var flag = true;
    const self = this;
    assemblys = self.get('model.content');
    assemblys.forEach(function(assembly) {
      if (cache.id === assembly.id) {
        flag = false;
      }
    });
    return flag;
  },

  fetchAllAssemblyId: function(assemblys) {
    var ids = [];
    assemblys.forEach(assembly => {
      ids.push(assembly.id)
    });
    return ids;
  },

  _removeCacheAssemblys: function() {
    const self = this;
    var rmvAssembly = self.fetchAllAssemblyId(self.get('cacheAssemblys')).filter(function(el) {
      return !self.fetchAllAssemblyId(self.get('model.content')).includes(el);
    });
    rmvAssembly.forEach(val => {
      var newcache = self.get('cacheAssemblys').filter(function(elem) {
        return elem.id != val;
      });
      self.set('cacheAssemblys', newcache);
    });
  },

  allAssemblys: function() {
    return this.get('model.content');
  }.property('cacheAssemblys'),

  machineAssemblys: function() {
    return this.filterAssembly("machine");
  }.property('cacheAssemblys'),

  containerAssemblys: function() {
    return this.filterAssembly("container");
  }.property('cacheAssemblys'),

  blockChainAssemblys: function() {
    return this.filterAssembly("blockchain");
  }.property('cacheAssemblys'),

  filterProperties: function() {
    return this.filterFromAssemblys();
  }.property('cacheAssemblys'),

  dFiltersContainer: function() {
    return DefaultFilter.defaultFiltersContainer();
  }.property('cacheAssemblys'),

  dFiltersMachine: function() {
    return DefaultFilter.defaultFiltersMachine();
  }.property('cacheAssemblys'),

  dFiltersBlockChain: function() {
    return DefaultFilter.defaultFiltersBlockChain();
  }.property('cacheAssemblys'),


  filterAssembly: function(value) {
    return this.get('cacheAssemblys').reduce(function(res, assembly) {
      if (assembly.spec.assembly_factory.object_meta.labels.rioos_category == value) {
        res.push(assembly);
      }
      return res;
    }, []);
  },

  actions: {
    search() {
      this.toggleProperty('isSearchVisible');
    }
  }
});
