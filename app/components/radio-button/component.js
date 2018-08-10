import Component from '@ember/component';

export default Component.extend({
  tagName:           'input',
  type:              'radio',
  disabled:          false,
  attributeBindings: ['name', 'type', 'checked:checked', 'disabled:disabled'],

  checked: function() {
    return this.get('value') === this.get('selection');
  }.property('value', 'selection'),

  click() {
    this.set('selection', this.get('value'));
  },

});
