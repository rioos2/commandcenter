import Ember from 'ember';
import C from 'nilavu/utils/constants';
const {
  get
} = Ember;
export default Ember.Component.extend({
  intl:       Ember.inject.service(),

  tagName: 'section',
  className: '',

  scalingRuleApplied: function() {
    return this.get('model.hscaling.horizontal_scaling_rule_apply');
  }.property('model.hscaling.horizontal_scaling_rule_apply'),

  resources: function() {
    return {
      maximum: {
        name: "chart-scale-max-disk",
        suffix: get(this, 'intl').t('launcherPage.scaling.scale.description'),
        title: get(this, 'intl').t('launcherPage.scaling.scaleup.disk.title')
      },
      minimum: {
        name: "chart-scale-min-disk",
        suffix: get(this, 'intl').t('launcherPage.scaling.scale.description'),
        title: get(this, 'intl').t('launcherPage.scaling.scaledown.disk.title')
      }
    };
  }.property(),

});
