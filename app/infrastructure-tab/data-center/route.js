import DefaultHeaders from 'nilavu/mixins/default-headers';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default Route.extend(DefaultHeaders, {

  storeReset: service(),

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
