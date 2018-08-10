import C from 'nilavu/utils/constants';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Component.extend({
  intl: service(),

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
