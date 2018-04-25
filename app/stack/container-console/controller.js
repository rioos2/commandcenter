import Ember from 'ember';
import Console from 'nilavu/mixins/console';

export default Ember.Controller.extend(Console, {
  queryParams: [
    'vnchost', 'account_id', 'id'
  ],
});
