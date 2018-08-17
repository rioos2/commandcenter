import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Component.extend({
  router:     service(),
  classNames:       ['container-list'],
  team:       alias('model.team'),

  teamStatus: function() {
    return 'success';
  }.property('team'),

  createdAt: function() {
    return this.profileTimestamp(this.get('team.object_meta.created_at'));
  }.property('team.object_meta.created_at'),

  actions: {
    goTeam(){
      this.get('router').transitionTo('organization.team', this.get('originName'), this.get('team.id'));
    }
  },


  profileTimestamp(date) {
    return moment(date).utcOffset(date).format('MMM DD, YYYY').toString();
  },

});
