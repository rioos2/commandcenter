import Ember from 'ember';
import PolledModel from 'nilavu/mixins/polled-model';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Route.extend(DefaultHeaders,{

  model: function() {
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%sfsdg%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
    const self = this;
    return this.get('store').find('reports', null,this.opts('healthz/overall')).then((reports) => {
      console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
      console.log(JSON.stringify(reports));
      return  reports;
    }).catch(function() {
      console.log("------------error----------------------------------");
      self.set('loading', false);
    });
  },

});
