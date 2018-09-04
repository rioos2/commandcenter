import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import C from 'nilavu/utils/constants';

export default Controller.extend({

  categories:  ['index'],
  panels:      [],
  selectedTab: ['index'],

  isAdmin: computed('session', function() {
    return get(this, 'session').get(C.SESSION.USER_ROLES);
  }),

});
