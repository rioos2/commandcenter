import Ember from 'ember';
import { get, computed } from '@ember/object';

export default Ember.Controller.extend({

  intl:          Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),

  // Contains the HTTP code to say if the telemetry system pull is active or not
  telemetryAvailabilityStatus: Ember.computed.alias('model.code'),

  // The route loads the model in healthzDashboard key, the actual data is inside
  // model.healthzDashboard.content
  healthzModel: computed('model.healthzDashboard', function(){
    const content =  get(this, 'model.healthzDashboard.content');

    return !Ember.isEmpty(content) ? content.get('firstObject') : [];
  }),

  // Datacenter overall usage using gauges.
  // the gauges shown are CPU, MEMORY, DISK and GPU.
  // section main gauges
  datacenterUsage: function() {
    return !Ember.isEmpty(this.get('healthzModel')) ? this.get('healthzModel').results.guages : [];
  }.property('healthzModel.@each.results.guages.counters.@each.counter'),

  // /// The section where we formulate the data to show in the statistics
  // section
  senseiStatistics: computed('healthzModel', function() {
    const content = get(this, 'healthzModel');

    return !Ember.isEmpty(content) ? content.results.statistics.senseis : [];
  }),

  ninjaStatistics: computed('healthzModel', function() {
    const content = get(this, 'healthzModel');

    return !Ember.isEmpty(content) ? content.results.statistics.ninjas : [];
  }),


  telemetryUnavailable: function() {
    if (get(this, 'telemetryAvailabilityStatus') == '502') {
      get(this, 'notifications').warning(get(this, 'intl').t('dashboard.error'), {
        htmlContent:   true,
        autoClear:     true,
        clearDuration: 6000,
        cssClasses:    'notification-warning'
      });
    }
  }.observes('telemetryAvailabilityStatus'),

  // Decider to show the statistis of ninja/sensei or not.
  hasNinjaStatistics: function() {
    return Ember.isEmpty(get(this, 'ninjaStatistics'));
  }.property('ninjaStatistics'),

  hasSenseiStatistics: function() {
    return Ember.isEmpty(get(this, 'senseiStatistics'));
  }.property('senseiStatistics'),

});
