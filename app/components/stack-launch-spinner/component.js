import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  large:   25,
  medium:  20,
  small:   16,
  show:    false,

  value: function() {
    return this.get('large');
  }.property('size'),

});
