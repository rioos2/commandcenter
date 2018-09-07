import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import { get } from "@ember/object";

export default Route.extend(DefaultHeaders, {
  model() {
    const store = get(this, 'store');
    return hash({ healthzDashboard: store.findAll('reportsstatistics',this.opts('healthz/overall')), });
  },
});
