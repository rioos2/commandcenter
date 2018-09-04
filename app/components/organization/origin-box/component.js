import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import C from 'nilavu/utils/constants';

export default Component.extend({
  intl:             service(),
  router:           service(),
  'tab-session':    service('tab-session'),
  classNames:       ['container-list'],
  origin:           alias('model'),
  createdAt:        alias('model.object_meta.created_at'),
  name:             alias('model.object_meta.name'),

  originStatus: function() {
    return  (this.get('name') === this.get('currentOrigin')) ? this.get('intl').t('nav.organization.show.statusSeleted') : this.get('intl').t('nav.organization.show.statusNotSeleted');
  }.property('origin'),

  createdAtMoment: function() {
    return this.profileTimestamp(this.get('createdAt'));
  }.property('createdAt'),

  currentOrigin: function() {
    return this.get('tab-session').get(C.TABSESSION.ORGANIZATION);
  }.property('tab-session'),

  actions: {
    goOrigin(){
      this.get('router').transitionTo('organization.organization', this.get('name'));
    }
  },


  profileTimestamp(date) {
    return moment(date).utcOffset(date).format('MMM DD, YYYY').toString();
  },

});
