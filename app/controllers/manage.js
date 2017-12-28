import Controller from '@ember/controller';

export default Controller.extend({
  isSearchVisible: false,

  assemblyLength: function() {
    return this.get('model.content').length;
  }.property('model'),

  updated: function() {
    // alert("hai2");
  }.observes('model'),

  allAssemblys: function() {
    return this.get('model.content');
  }.property('model'),

  machineAssemblys: function() {
    return this.filterAssembly("Assemblys");
  }.property('model'),

  containerAssemblys: function() {
    return this.filterAssembly("container");
  }.property('model'),

  blockChainAssemblys: function() {
    return this.filterAssembly("bloackchain");
  }.property('model'),


  filterAssembly: function(value) {
    return this.get('model.content').reduce(function(res, assembly) {
      if (assembly.type_meta.kind == value) {
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
