/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';

export default Ember.Component.extend(DefaultHeaders, {
  session: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  noImage: true,
  validationWarning: '',

  selectionChecker: function() {
    this.set("network", this.get("model.assemblyfactory.network"));
  }.observes('model.assemblyfactory.network'),

  distroChecker: function() {
    this.set("noImage", false);
  }.observes('model.assemblyfactory.os'),

  distroNameFromPlan: function() {
    if(this.get("model.assemblyfactory.os") == undefined) {
      this.set('noImage', true);
    } else {
      this.set('noImage', false);
    }
    return this.get("model.assemblyfactory.os");
  }.property('model.assemblyfactory.os'),

  domainExisit: function() {
    return Ember.isEmpty(this.get('model.assemblyfactory.object_meta.name'));
  }.property('model.assemblyfactory.name'),

  regionExisit: function() {
    return Ember.isEmpty(this.get('model.assemblyfactory.object_meta.cluster_name'));
  }.property('model.assemblyfactory.object_meta.cluster_name'),


  validation() {
    if(Ember.isEmpty(this.get('model.assemblyfactory.object_meta.name'))) {
      this.set('validationWarning', 'Please enter domain name on step 2');
      return true;
    } else if (Ember.isEmpty(this.get('model.assemblyfactory.os'))) {
      this.set('validationWarning', 'Please select image on step 5');
      return true;
    } else {
      return false;
    }
  },

  actions: {
    createAssemblyFactory() {
      if (!this.validation()) {
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
        this.get('notifications').warning(this.get('validationWarning'), {
          autoClear: true,
          clearDuration: 4200
        });
      }
    },
  }

});
