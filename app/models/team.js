import Resource from 'ember-api-store/models/resource';
import { inject as service } from '@ember/service';

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

  actions: {

    goTeam(){
      this.get('router').transitionTo('organization.team', this.get('metadata.origin'), this.get('team.id'));
    },

    selectTeam() {
      this.get('organization').selectOrganizationAndTeam(this.get('metadata.origin'), this.get('team.full_name'));

      location.reload();
    }

  },
  type:    'team',
});

export default Team;
