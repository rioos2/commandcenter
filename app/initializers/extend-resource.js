import DolphinTransitioningResource from 'nilavu/mixins/dolphin-transitioning-resource';
import Resource from 'ember-api-store/models/resource';

export function initialize(/* application*/) {
  Resource.reopen(DolphinTransitioningResource);
  Resource.reopenClass({
    defaultStateIcon:  'icon icon-help',
    defaultStateColor: 'text-primary',
    defaultSortBy:     'name',
  });
}

export default {
  name:       'extend-resource',
  initialize
};
