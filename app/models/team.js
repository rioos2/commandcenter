import Resource from 'ember-api-store/models/resource';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { later } from '@ember/runloop';
import C from 'nilavu/utils/constants';

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
      enabled: this.get('switchActionCheck'),
    }
    ];
  }.property('id', 'actionLinks'),

  switchActionCheck: function() {
    return  !(this.get('tab-session').get(C.TABSESSION.TEAM) === this.get('team.full_name'));
  }.property('team.full_name'),

  router:        service(),
  organization:  service(),
  teamUpdate:    null,
  'tab-session': service('tab-session'),

  actions: {

    goTeam(){
      alert(JSON.stringify(this.get('team.full_name')));
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
