import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Component.extend({
  intl:       service(),

  tagName:   'section',
  className: '',

  scalingRuleApplied: function(){
    return this.get('model.hscaling.horizontal_scaling_rule_apply');
  }.property('model.hscaling.horizontal_scaling_rule_apply'),

  resources: function() {
    return {
      maximum: {
        name:   'chart-scale-max-memory',
        suffix: get(this, 'intl').t('launcherPage.scaling.percent'),
        title:  get(this, 'intl').t('launcherPage.scaling.up.memory.title')
      },
      minimum: {
        name:   'chart-scale-min-memory',
        suffix: get(this, 'intl').t('launcherPage.scaling.percent'),
        title:  get(this, 'intl').t('launcherPage.scaling.down.memory.title')
      }
    };
  }.property(),

});
