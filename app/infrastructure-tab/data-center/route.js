import Ember from 'ember';
import PolledModel from 'nilavu/mixins/polled-model';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Route.extend(DefaultHeaders,{

  model: function() {
    const self = this;
    return this.get('store').findAll('reports',this.opts('healthz/overall')).then((reports) => {
      return  reports;
    }).catch(function(err) {
      self.set('loading', false);
      return err;
    });
  },

});
