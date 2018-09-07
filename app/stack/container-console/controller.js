import Controller from '@ember/controller';
import Console from 'nilavu/mixins/console';

export default Controller.extend(Console, {
  queryParams: [
    'vnchost', 'account_id', 'id'
  ],
});
