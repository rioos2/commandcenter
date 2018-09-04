import Resource from 'ember-api-store/models/resource';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import { getOwner } from '@ember/application';


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
      enabled: true,
    }
    ];
  }.property('id', 'actionLinks'),

  organizationUpdate:    null,
  router:             service(),
  organization:       service(),

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
