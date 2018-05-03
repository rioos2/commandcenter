import Ember from "ember";

export default Ember.Controller.extend({
  settings: Ember.inject.service(),

  // GitHub auth params
  queryParams: ['error_description', 'state', 'code', 'isTest', 'isPopup', 'access_token', 'redirectTo'],

  tooltipService: Ember.inject.service('tooltip'),
  resourceActions : Ember.inject.service('resource-actions'),

  tooltip: Ember.computed.alias('tooltipService.tooltipOpts.type'),
  tooltipTemplate: Ember.computed.alias('tooltipService.tooltipOpts.template'),

  error: null,
  error_description: null,
  state: null,
  code: null,
  isTest: null,
  isPopup: null,
  redirectTo: null,
  bassContainerCss: "container",

  actions: {
    clickedAction: function(actionName) {
      this.get('resourceActions').triggerAction(actionName);
    },
 },

  // currentRouteName is set by Ember.Router
  // but getting the application controller to get it is inconvenient sometimes
  currentRouteNameChanged: function () {
    if (this.get('currentRouteName') == "stacks.createcloud" || this.get('currentRouteName') == "stacks.createcontainer") {
      this.set('bassContainerCss', "");
    } else {
      this.set('bassContainerCss', "container");
    }
    this.set('app.currentRouteName', this.get('currentRouteName'));
  }.observes('currentRouteName'),

});
