import Ember from "ember";
const {
  get
} = Ember;
export default Ember.Controller.extend({

  intl: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),

  reportSensei: function() {
      return !Ember.isEmpty(this.get('model.content')) ? this.get('model.content').objectAt(0).results.statistics.sensei : [];
  }.property('model'),

  reportNinja: function() {
      return !Ember.isEmpty(this.get('model.content')) ? this.get('model.content').objectAt(0).results.statistics.nodes : [];
  }.property('model'),

  reportGauge: function() {
      return !Ember.isEmpty(this.get('model.content')) ? this.get('model.content').objectAt(0).results.guages : [];
  }.property('model.content.@each.results.guages.counters.@each.counter'),

  alertMessage: function() {
    if (this.get("model.code") == "502") {
      this.get('notifications').warning(get(this, 'intl').t('dashboard.error'), {
        htmlContent: true,
        autoClear: true,
        clearDuration: 6000,
        cssClasses: 'notification-warning'
      });
    }
  }.observes('model.code'),

  checkEmptyNinja: function() {
    return Ember.isEmpty(this.get('reportNinja'));
  }.property('reportNinja'),

  checkEmptySensei: function() {
    return Ember.isEmpty(this.get('reportSensei'));
  }.property('reportSensei'),

});
