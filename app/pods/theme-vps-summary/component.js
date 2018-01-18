/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';

export default Ember.Component.extend(DefaultHeaders, {
  session: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),

  selectionChecker: function() {
    this.set("network", this.get("model.assemblyfactory.network"));
  }.observes('model.assemblyfactory.network'),

  distroNameFromPlan: function() {
    return this.get("model.assemblyfactory.os");
  }.property('model.assemblyfactory.os'),

  domainExisit: function() {
    return this.checkDomain();
  }.property('model.assemblyfactory.name'),

  checkDomain() {
    return Ember.isEmpty(this.get('model.assemblyfactory.object_meta.name'));
  },

  actions: {
    createAssemblyFactory() {
      if (!this.checkDomain()) {
        this.set('showSpinner', true);
        var session = this.get("session");
        var id = this.get("session").get("id");
        this.set("model.assemblyfactory.object_meta.account", id);
        var url = 'accounts/' + id + '/assemblyfactorys';

        this.get('model.assemblyfactory').save(this.opts(url)).then(() => {
          location.reload();
        }).catch(err => {
          this.get('notifications').error('Launch failed.', {});
          this.set('showSpinner', false);
        });
      } else {
        this.get('notifications').warning('Please enter domain name on step 2', {
          autoClear: true,
          clearDuration: 4200
        });
      }
    },
  }

});
