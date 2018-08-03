import Ember from 'ember';
import C from 'nilavu/utils/constants';
import { isAlternate } from 'nilavu/utils/platform';

export default Ember.Component.extend({
  resourceActions: Ember.inject.service('resource-actions'),
  icon:            'icon-help',
  label:           '',
  prefix:          null,
  enabled:         true,
  actionArg:       null,
  altActionArg:    null,

  tagName:           'a',
  classNameBindings: ['enabled::hide'],
  attributeBindings: ['tabindex'],
  tabindex:          0,


  iconChanged: function() {
    this.rerender();
  }.observes('icon'),
  willRender() {
    var icon = this.get('icon');

    if ( icon.indexOf('icon-') === -1 ) {
      this.set('prefix', 'icon icon-fw');
    }
  },


  click(event) {
    if ( isAlternate(event) && this.get('altActionArg')) {
      this.sendAction('action', this.get('altActionArg'));
    } else {
      this.sendAction('action', this.get('actionArg'));
    }
  },

  keyPress(event) {
    if ( [C.KEY.CR, C.KEY.LF].indexOf(event.which) >= 0 ) {
      this.click(event);
      this.get('resourceActions').hide();
    }
  },

});
