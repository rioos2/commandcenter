import Ember from 'ember';
const {
  get
} = Ember;
import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';
export default Ember.Component.extend(DefaultHeaders, {
  intl: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  session: Ember.inject.service(),


  useTrailVersionNote: function() {
    return Ember.String.htmlSafe(get(this, 'intl').t('wizard.useTrailVersionNote'));
  }.property('model'),

  licencePlaceholder: function() {
    return get(this, 'intl').t('wizard.licencePlaceholder');
  }.property('model'),


  actions: {

    processTrail: function() {
      this.sendAction('processTrail');
    },

    updateLicence: function() {
      //To-do Need to implement licence request
    },

  },

});
