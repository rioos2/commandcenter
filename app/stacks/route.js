import Ember from 'ember';
import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Route.extend(DefaultHeaders,{

    queryParams: {
        os: { refreshModel: true }, //Select by OS
        location: { refreshModel: true }, //Select by location
        db: { refreshModel: true }, //Select by db
        status: { refreshModel: true }, //select by status
        network: { refreshModel: true }, //select by status
        search: { refreshModel: true }, //search
    },

    actions: {
        refresh: function () {
            // Clear the cache so it has to ask the server again
            this.set('cache', null);
            this.refresh();
        },
    },


    deactivate() {
        // Clear the cache when leaving the route so that it will be reloaded when you come back.
        this.set('cache', null);
    },


    model(params) {
        return Ember.RSVP.hash({
          stacks: this.get('store').findAll('assembly',this.opts('accounts/' + this.get('session').get("id") + '/assemblys')),
          stacksfactory: this.get('store').findAll('stacksfactory',this.opts('accounts/' + this.get('session').get("id") + '/stacksfactorys')),
        });
    },

    resetController: function(controller) {
      var queryParams = controller.get('queryParams');
      queryParams.forEach(function(param) {
        controller.set(param, null);
      });
    },

});
