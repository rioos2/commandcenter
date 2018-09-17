import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';


export default Controller.extend({
  summaryContent: null,
  stacksfactory:  alias('model.stacksfactory'),
  secret:         alias('model.secret'),
  datacenters:    alias('model.datacenters'),
  plans:          alias('model.plans'),
  settings:       alias('model.settings'),
  networks:       alias('model.networks'),
});
