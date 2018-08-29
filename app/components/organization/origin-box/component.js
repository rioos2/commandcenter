import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Component.extend({
  intl:             service(),
  router:           service(),
  classNames:       ['container-list'],
  origin:           alias('model'),
  createdAt:        alias('model.object_meta.created_at'),
  name:             alias('model.object_meta.name'),

  originStatus: function() {
    return this.get('intl').t('nav.organization.show.status');
  }.property('origin'),

  createdAtMoment: function() {
    return this.profileTimestamp(this.get('createdAt'));
  }.property('createdAt'),

  actions: {
    goOrigin(){
      this.get('router').transitionTo('organization.organization', this.get('name'));
    }
  },


  profileTimestamp(date) {
    return moment(date).utcOffset(date).format('MMM DD, YYYY').toString();
  },

});
