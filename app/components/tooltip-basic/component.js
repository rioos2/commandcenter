import Component from '@ember/component';
import Tooltip from 'nilavu/mixins/tooltip';
import { alias } from '@ember/object/computed';

export default Component.extend(Tooltip, {
  needs:   ['application'],
  display: null,

  model:         alias('tooltipService.tooltipOpts.model'),
  selectPartial: function() {
    var template = this.get('tooltipService.tooltipOpts.template');
    var out      = template;

    if (!template) {
      out = 'tooltip-basic';
    }

    return out;
  }.property('tooltipService.tooltipOpts.template')

});
