import Resource from 'ember-api-store/models/resource';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import { getOwner } from '@ember/application';
import C from 'nilavu/utils/constants';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';



var Origin = Resource.extend({

  name:           alias('object_meta.name'),


  availableActions: function() {

    return [{
      label:   'action.view',
      icon:    'fa fa-eye',
      action:  'goToOrigin',
      enabled: true,
    },
    {
      label:   'action.switch',
      icon:    'fa fa-toggle-on',
      action:  'switchOrigin',
      enabled:  this.get('canSwitch'),
    }
    ];
  }.property('id', 'actionLinks'),

  canSwitch: computed('name', function() {
    return  !(this.get('tab-session').get(C.TABSESSION.ORGANIZATION) === this.get('name'));
  }),

  waitAndChangeOrganization:    null,
  router:                    service(),
  organization:              service(),
  'tab-session':             service('tab-session'),

  actions: {

    goToOrigin(){
      this.get('router').transitionTo('organization.organization', this.get('name'));
    },

    switchOrigin() {
      let authenticated = getOwner(this).lookup('route:authenticated');

      authenticated.send('switchOrigin', this.get('name'));
      this.set('waitAndChangeOrganization', later(() => {
        location.reload();
      }, 3000));
    }

  },
  type:    'origin',

});

export default Origin;
