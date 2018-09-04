import Resource from 'ember-api-store/models/resource';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import { getOwner } from '@ember/application';
import C from 'nilavu/utils/constants';


var Origin = Resource.extend({

  availableActions: function() {

    return [{
      label:   'action.view',
      icon:    'fa fa-eye',
      action:  'goOrigin',
      enabled: true,
    },
    {
      label:   'action.switch',
      icon:    'fa fa-toggle-on',
      action:  'selectOrigin',
      enabled:  this.get('switchActionCheck'),
    }
    ];
  }.property('id', 'actionLinks'),

  switchActionCheck: function() {
    return  !(this.get('tab-session').get(C.TABSESSION.ORGANIZATION) === this.get('object_meta.name'));
  }.property('object_meta.name'),

  organizationUpdate:    null,
  router:             service(),
  organization:       service(),
  'tab-session':      service('tab-session'),

  actions: {

    goOrigin(){
      this.get('router').transitionTo('organization.organization', this.get('object_meta.name'));
    },

    selectOrigin() {
      let authenticated = getOwner(this).lookup('route:authenticated');

      authenticated.send('switchOrigin', this.get('object_meta.name'));
      this.set('organizationUpdate', later(() => {
        location.reload();
      }, 3000));
    }

  },
  type:    'origin',

});

export default Origin;
