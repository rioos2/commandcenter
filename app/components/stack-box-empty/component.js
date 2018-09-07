import C from 'nilavu/utils/constants';
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  intl: service(),

  actions: {
    deploy() {
      switch (this.get('group')) {
      case C.CATEGORIES.MACHINE:
        this.get('router').transitionTo('machines.new.');
        break;
      case C.CATEGORIES.CONTAINER:
        this.get('router').transitionTo('containers.new');
        break;
      default:
        this.get('router').transitionTo('machines.new');
      }
    }
  }
});
