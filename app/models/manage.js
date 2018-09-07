import Ember from 'ember';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import C from 'nilavu/utils/constants';

export default Resource.extend({

  defaultActionLinks: function() {
    return {
      console: "https://localhost:8000/v2-beta/machinedrivers/1md2/?action=reactivate",
      delete: "https://localhost:8000/v2-beta/machinedrivers/1md2/?action=deactivate"
  }
},


availableActions: function() {
  // let a = this.defaultActionLinks();
  var a = this.get('actionLinks');

  return [
    { label: 'delete',    icon: 'icon icon-play',         action: 'a.delete',     enabled: true},
    { label: 'console',  icon: 'icon icon-pause',        action: 'a.console',   enabled: true},
  ];
}.property('actionLinks.{delete,console}'),

actions: {
  delete() {
      return this.doAction('delete');
  },
  console() {
      return this.doAction('console');
  },
},

});

// export default Catalog;
//
// Catalog.reopenClass({
//   pollTransitioningDelay: 1000,
//   pollTransitioningInterval: 5000,
// });
