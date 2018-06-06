import Ember from 'ember';
const {
  get
} = Ember;
import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
export default Ember.Component.extend(DefaultHeaders, {
  intl: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),

  nameSelect: function() {
    this.set('name',this.get('model.object_meta.name'));
  }.observes('model.object_meta.name'),

  hostIp: function() {
    return this.get('model.host_ip');
  }.property('model.host_ip'),

  type: function() {
    return this.get('model.storage_type');
  }.property('model.storage_type'),

  status: function() {
    return this.get('model.status.phase');
  }.property('model.status.phase'),

  getData: function() {
    this.set('model.object_meta.name',this.get('name'));
    return this.get('model');
  },
  validation() {
    if (Ember.isEmpty(this.get('name'))) {
      this.set('validationWarning', get(this, 'intl').t('stackPage.admin.storage.nameError'));
    return true;
  }
  return false;
},

actions: {

  editStorage: function() {
    this.set('showSpinner', true);
    if (!this.validation()) {
      this.get('userStore').rawRequest(this.rawRequestOpts({
        url: '/api/v1/storageconnectors/' + this.get('model.id'),
        method: 'PUT',
        data: this.getData(),
      })).then((xhr) => {
        this.set('showSpinner', false);
        this.set('modelSpinner', true);
        this.sendAction('doReloaded');
      }).catch((err) => {
        this.set('showSpinner', false);
        this.set('modelSpinner', false);
      });
    } else {
      this.set('showSpinner', false);
      this.get('notifications').warning(Ember.String.htmlSafe(this.get('validationWarning')), {
        autoClear: true,
        clearDuration: 4200,
        cssClasses: 'notification-warning'
      });
    }
  },
}

});
