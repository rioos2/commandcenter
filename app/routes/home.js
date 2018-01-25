import Ember from 'ember';
import PolledModel from 'nilavu/mixins/polled-model';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Route.extend(PolledModel,DefaultHeaders,{
  activate: function() {
    this.send('unfixedTop');
    this.send('unfixedBottom');
  },
  deactivate: function() {
    this.send('unfixedTop');
    this.send('unfixedBottom');
  },

  model: function() {
    const self = this;
    return this.get('store').findAll('reports', this.opts('healthz/overall')).then((reports) => {
      return  reports;
    }).catch(function() {
      self.set('loading', false);
    });
  },

});
