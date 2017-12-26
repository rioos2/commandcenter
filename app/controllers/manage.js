import Controller from '@ember/controller';

export default Controller.extend({
  isSearchVisible: false,

  allAssemblys: function() {
    return this.get('model.content');
  }.property('model'),

  machineAssemblys: function() {
    return this.filterAssembly("machine");
  }.property('model'),

  containerAssemblys: function() {
    return this.filterAssembly("container");
  }.property('model'),

  blockChainAssemblys: function() {
    return this.filterAssembly("bloackchain");
  }.property('model'),


  filterAssembly: function(value) {
    return this.get('model.content').reduce(function(res, assembly) {
      if (assembly.assembly_factory.object_meta.labels.rioos_category == value) {
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
