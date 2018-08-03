import C from 'nilavu/utils/constants';
const { get } = Ember;

export default Ember.Component.extend({
  intl: Ember.inject.service(),

  buttonName: function() {
    return get(this, 'intl').t('stackPage.launchCloud');
  }.property('buttonName'),

  actions: {
    launchCloud() {
      switch (this.get('group')) {
      case C.CATEGORIES.MACHINE:
        this.get('router').transitionTo('stacks.createcloud');
        break;
      case C.CATEGORIES.CONTAINER:
        this.get('router').transitionTo('stacks.createcontainer');
        break;
      default:
        this.get('router').transitionTo('stacks.createcloud');
      }
    }
  }
});
