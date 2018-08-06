import Component from '@ember/component';
import { isAlternate } from 'nilavu/utils/platform';
import { inject } from '@ember/service';
import { alias } from '@ember/object/computed';
import $ from 'jquery';
import { get } from '@ember/object';

export default Component.extend({
  resourceActions: inject.service('resource-actions'),

  tooltipService: inject.service('tooltip'),

  model:       null,
  size:        'xs',
  showPrimary: true,
  inTooltip:   false,

  tagName:        'div',
  classNames:     ['btn-group', 'resource-actions', 'action-menu'],
  primaryAction: alias('model.primaryAction'),

  click(e) {
    var tgt = $(e.target);
    var more = tgt.closest('.more-actions');

    if ( more && more.length ) {
      e.preventDefault();

      e.stopPropagation();

      if (this.get('inTooltip')) {
        this.get('resourceActions').set('tooltipActions', true);
      } else {
        this.get('resourceActions').set('tooltipActions', false);
      }

      this.get('resourceActions').show(this.get('model'), more, this.$());
    } else {

      let idx = parseInt(tgt.closest('BUTTON').data('primary'), 10);

      if ( !isNaN(idx) ) {
        var action = this.get('model.primaryAction');

        if ( action ) {
          e.preventDefault();
          e.stopPropagation();

          if ( isAlternate(e) && get(action, 'altAction') ) {
            this.sendToModel(get(action, 'altAction'));
          } else {
            this.sendToModel(get(action, 'action'));
          }
        }
      }
    }
  },

  sendToModel(action) {
    this.get('tooltipService').leave();
    this.get('model').send(action);
  },
});
