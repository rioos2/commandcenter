import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Route.extend(DefaultHeaders, {
      resetController: function (controller, isExiting, transition) {
        if (isExiting) {
          this.transitionTo({queryParams: {os: "", location: "", db: "", status: "", network: "", search: "" }});
        }
    },
});
