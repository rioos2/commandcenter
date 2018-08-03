import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Route.extend(DefaultHeaders, {

  storeReset: Ember.inject.service(),

  model() {

    const self = this;

    return this.get('store').findAll('reportsstatistics', this.opts('healthz/overall')).then((reports) => {
      return  { 'healthzDashboard': reports };
    }).catch((err) => {
      self.set('loading', false);

      return err;
    });
  }
});
