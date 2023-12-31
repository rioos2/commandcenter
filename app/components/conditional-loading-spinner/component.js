export default Ember.Component.extend({
  tagName: '',
  large: 25,
  medium: 20,
  small: 16,
  show: false,

  value: function () {
    return this.get('large');
  }.property('size'),

  hide: function () {
    this.set('show', this.get('condition'));
  }.observes('condition'),

});
