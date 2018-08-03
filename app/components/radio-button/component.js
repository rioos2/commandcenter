import Ember from 'ember';

export default Ember.Component.extend({
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
