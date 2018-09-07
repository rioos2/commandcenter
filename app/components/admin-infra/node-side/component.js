import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  intl: service(),

  name: function() {
    return this.get('model.object_meta.name');
  }.property('model'),

  ip: function() {
    return this.get('model.node_ip');
  }.property('model.node_ip'),

  status: function() {
    return isEmpty(this.get('model.status.phase')) ? '' : this.get('model.status.phase').capitalize();
  }.property('model.status.phase'),

  emptyError: function() {
    return this.get('intl').t(`stackPage.admin.${  this.get('type')  }.noNode`);
  }.property('type'),

  bridges: function() {
    return isEmpty(this.get('model.status.node_info.bridges')) ? '' : this.get('model.status.node_info.bridges') ;
  }.property('model.status.node_info.bridges'),

  nodeAvailable: function() {
    return !(isEmpty(this.get('status')) && isEmpty(this.get('name')) && isEmpty(this.get('ip')) );
  }.property('status', 'name', 'ip'),


});
