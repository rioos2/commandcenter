import Ember from 'ember';
import { isAlternate } from 'nilavu/utils/platform';

export default Ember.Component.extend({
  resourceActions: Ember.inject.service('resource-actions'),

  tooltipService: Ember.inject.service('tooltip'),

  model:       null,
  size:        'xs',
  showPrimary: true,
  inTooltip:   false,

  tagName:        'div',
  classNames:     ['btn-group', 'resource-actions', 'action-menu'],
  primaryAction: Ember.computed.alias('model.primaryAction'),

  click(e) {
    var tgt = Ember.$(e.target);
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

          if ( isAlternate(e) && Ember.get(action, 'altAction') ) {
            this.sendToModel(Ember.get(action, 'altAction'));
          } else {
            this.sendToModel(Ember.get(action, 'action'));
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
