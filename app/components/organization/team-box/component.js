import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),

  classNames:       ['container-list'],
  teamStatus: function() {
    return 'success';
  }.property('model.status'),

  actions: {
    goTeam(){
      this.get('router').transitionTo('organization.team', this.get('originName'), this.get('model.object_meta.name'));
    }
  },


});
