const { get } = Ember;

export default Ember.Component.extend({
  intl: Ember.inject.service(),

  buttonName: function() {
    return get(this, 'intl').t('stackPage.launchCloud');
  }.property('buttonName'),

  actions: {
    launchCloud: function() {
      this.get('router').transitionTo('stacks.createcloud');
    }
  }
});
