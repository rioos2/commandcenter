import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Route.extend(DefaultHeaders, {

  queryParams: {
    os:       { refreshModel: true }, // Select by OS
    location: { refreshModel: true }, // Select by location
    db:       { refreshModel: true }, // Select by db
    status:   { refreshModel: true }, // select by status
    network:  { refreshModel: true }, // select by status
    search:   { refreshModel: true }, // search
  },

  model(params) {
    return Ember.RSVP.hash({
      stacks:        this.get('store').findAll('assembly', this.opts('assemblys')),
      stacksfactory: this.get('store').findAll('stacksfactory', this.opts('stacksfactorys')),
    });
  },

  resetController(controller) {
    var queryParams = controller.get('queryParams');

    queryParams.forEach((param) => {
      controller.set(param, null);
    });
  },

  deactivate() {
    // Clear the cache when leaving the route so that it will be reloaded when you come back.
    this.set('cache', null);
  },


  actions: {
    refresh() {
      // Clear the cache so it has to ask the server again
      this.set('cache', null);
      this.refresh();
    },
  },

});
