import Resource from  'ember-api-store/models/resource';
import CattleTransitioningResource from 'nilavu/mixins/cattle-transitioning-resource';

export function initialize(application) {
  // alert(CattleTransitioningResource);
  Resource.reopen(CattleTransitioningResource);
  Resource.reopenClass({
    defaultStateIcon: 'icon icon-help',
    defaultStateColor: 'text-primary',
    defaultSortBy: 'name',
  });
}

export default {
  name: 'extend-resource',
  initialize: initialize
};
