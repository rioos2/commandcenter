import {buildAdminInfraPanel} from '../admin-infra-panel/component';
export default buildAdminInfraPanel('network', {
  // tagName: 'tr' ,

  count: function(){
    return this.get('model.networks.content').length;
  }.property('model.networks.content'),

  NoNetwork: function() {
    return this.get('model.networks.content').length < 0 ? true:false;
  }.property('model'),

  networks: function() {
    return this.get('model.networks.content');
  }.property('model.networks.content'),

});
