import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Component.extend({
  router:     service(),
  classNames:       ['container-list'],
  origin:       alias('model'),

  originStatus: function() {
    return 'success';
  }.property('origin'),

  createdAt: function() {
    return this.profileTimestamp(this.get('origin.object_meta.created_at'));
  }.property('origin.object_meta.created_at'),

  actions: {
    goOrigin(){
      this.get('router').transitionTo('organization.organization', this.get('origin.object_meta.name'));
    }
  },


  profileTimestamp(date) {
    return moment(date).utcOffset(date).format('MMM DD, YYYY').toString();
  },

});
