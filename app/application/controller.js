import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { run } from '@ember/runloop';
import { observer } from '@ember/object';

export default Controller.extend({
  settings: service(),

  tooltipService:  service('tooltip'),
  resourceActions: service('resource-actions'),

  // Rio/OS auth params
  // Used to when error occurs we want to get back to previous page
  // TO-DO verifiy
  queryParams: ['redirectTo'],
  redirectTo:        null,

  init() {
    this._super(...arguments);

    if (this.get('app.environment') === 'development') {
      run.backburner.DEBUG = true;
    }
  },

  tooltip:         oneWay('tooltipService.tooltipOpts.type'),
  tooltipTemplate: oneWay('tooltipService.tooltipOpts.template'),

  // TO-DO: Rathish, why is a css thing referenced here based on route  ?
  // I believe what you are looking for is  add a  css  "container" when route
  // are deployment
  // currentRouteName is set by Ember.Router
  // but getting the application controller to get it is inconvenient sometimes
  currentRouteNameChanged: observer('currentRouteName', function() {
    if (this.get('currentRouteName') == 'stacks.new.digitalcloud' || this.get('currentRouteName') == 'stacks.new.container' || this.get('currentRouteName') == 'stacks.new.blockchain_network' || this.get('currentRouteName') == 'stacks.new.blockchain_app') {
      this.set('bassContainerCss', '');
    } else {
      this.set('bassContainerCss', 'container');
    }
    this.set('app.currentRouteName', this.get('currentRouteName'));
  }),

  // TO-DO: Rathish, where is this used.
  actions: {
    clickedAction(actionName) {
      this.get('resourceActions').triggerAction(actionName);
    },
  },

});
