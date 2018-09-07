import Resource from 'ember-api-store/models/resource';

export default Resource.extend({

  availableActions: function() {
    return [
      {
        label:   'delete',
        icon:    'icon icon-play',
        action:  'a.delete',
        enabled: true
      },
      {
        label:   'console',
        icon:    'icon icon-pause',
        action:  'a.console',
        enabled: true
      },
    ];
  }.property('actionLinks.{delete,console}'),

  defaultActionLinks() {
    return {
      console: 'https://localhost:8000/v2-beta/machinedrivers/1md2/?action=reactivate',
      delete:  'https://localhost:8000/v2-beta/machinedrivers/1md2/?action=deactivate'
    }
  },


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
