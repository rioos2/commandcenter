import Resource from 'ember-api-store/models/resource';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { later } from '@ember/runloop';
import C from 'nilavu/utils/constants';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';


var Team = Resource.extend({

  fullName:   alias('team.full_name'),
  originName: alias('metadata.origin'),

  availableActions: function() {

    return [{
      label:   'action.view',
      icon:    'fa fa-eye',
      action:  'goToTeam',
      enabled: true,
    },
    {
      label:   'action.switch',
      icon:    'fa fa-toggle-on',
      action:  'switchTeam',
      enabled: this.get('canSwitch'),
    }
    ];
  }.property('id', 'actionLinks'),

  canSwitch: computed('fullName', function() {
    return  !(this.get('tab-session').get(C.TABSESSION.TEAM) === this.get('fullName'));
  }),

  router:            service(),
  organization:      service(),
  waitAndChangeTeam:    null,
  'tab-session':     service('tab-session'),

  actions: {

    goToTeam(){
      this.get('router').transitionTo('organization.team', this.get('originName'), this.get('team.id'));
    },

    switchTeam() {
      let authenticated = getOwner(this).lookup('route:authenticated');

      authenticated.send('switchOrigin', this.get('originName'), this);
      this.set('waitAndChangeTeam', later(() => {
        location.reload();
      }, 2000));
    }

  },
  type:    'team',
});

export default Team;
