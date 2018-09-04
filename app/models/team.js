import Resource from 'ember-api-store/models/resource';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { later } from '@ember/runloop';

var Team = Resource.extend({

  availableActions: function() {

    return [{
      label:   'action.view',
      icon:    'fa fa-eye',
      action:  'goTeam',
      enabled: true,
    },
    {
      label:   'action.switch',
      icon:    'fa fa-toggle-on',
      action:  'selectTeam',
      enabled: true,
    }
    ];
  }.property('id', 'actionLinks'),

  router:       service(),
  organization: service(),
  teamUpdate:   null,

  actions: {

    goTeam(){
      this.get('router').transitionTo('organization.team', this.get('metadata.origin'), this.get('team.id'));
    },

    selectTeam() {
      let authenticated = getOwner(this).lookup('route:authenticated');

      authenticated.send('switchOrigin', this.get('metadata.origin'), this);
      this.set('teamUpdate', later(() => {
        location.reload();
      }, 2000));
    }

  },
  type:    'team',
});

export default Team;
