import DefaultHeaders from 'nilavu/mixins/default-headers';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend(DefaultHeaders, {

  access:    service(),
  userStore: service('user-store'),

  model() {
    return hash({
      storageConnectors: this.get('store').findAll('storage', this.opts('storageconnectors', true)),
      storagesPool:      this.get('store').findAll('storagepool', this.opts('storagespool', true)),
      datacenters:       this.get('store').findAll('datacenter', this.opts('datacenters', true)),
      networks:          this.get('store').findAll('network', this.opts('networks', true)),
      nodes:             this.get('store').findAll('node', this.opts('nodes')),
      license:           this.get('store').findAll('license', this.opts('licenses', true)),
      senseis:           this.get('store').findAll('sensei', this.opts('senseis')),
      // logs:              this.get('store').find('log', null, this.opts('logs')),
      // audits:            this.get('store').find('audit', null, this.opts('audits')),
      accounts:          this.get('store').find('account', null, this.opts('accounts')),
      alertRules:        this.rules(),
    });
  },

  rules() {
    return [
    {
      "id": "333333333333333333333333333333333333333",
"object_meta": {
  "name": "role_group"
},
"state": "inactive",
"rules": [
  {
    "rule_type": "NodesDown",
    "reason": "When a specific, node is down. Type the node id or node name.",
    "for": "",
    "record": "",
    "expression": "up{job='rioos_sh_nodes',rioos_node_name='{{rioos_node_name}}', rioos_node_id='{{rioos_node_id}}'} == 0",
    "labels": {"rioos_node_name": "", "rioos_node_id": ""},
    "annotations": {
    "rioos_sh_alert_repeat_interval": "1h",
  },
    "description": "Node {{rioos_node_name}} {{rioos_node_id}}"
    
  }
]
},
{
  "id": "222222222222222222222222222222",
"object_meta": {
  "name": "role_group"
},
"state": "inactive",
"rules": [
  {
    "rule_type": "InstanceDown",
    "for": "",
    "record": "",
    "expression": "query={{'{{clip_level}}' - (avg by (rioos_assembly_id) (irate('{{clip_name}}'{job='rioos-assemblys',mode='idle',rioos_assemblyfactory_id='{{rioos_assemblyfactory_id}}'}[5m])) * 100)",
    "labels": {"rioos_assemblyfactory_id": "", "clip_level": "70" },
    "annotations": {
        "rioos_sh_alert_repeat_interval": "1h" 
      },
  "reason": "When instance (Digital cloud/Containers) clip level reaches %",
  "description": "An instance named {{rioos_assemblyfactory_name}}, id {{rioos_assemblyfactory_id}} has {{clip_name}} >= {{clip_level}}"
    }
  
]
},
{
"id": "1111111111111111111",
"object_meta": {
  "name": "role_group"
},
"state": "inactive",
"rules": [
  {
    "rule_type": "NodesDown",
    "for": "",
    "record": "When all nodes are down.",
    "expression": "up { job='rioos_sh_nodes'} == 0",
    "labels": {},
    "annotations": {
    "rioos_sh_alert_repeat_interval": "1h",
     },
    "reason": "InstanceDown",
    "description": "All nodes are down"
   
  }
]
}
 ];
  },

  actions: {
    // This will reload after edit processed by component
    reloadModel() {
      var self = this;

      self.controller.set('modelSpinner', true);
      this.model().then((res) => {
        self.controller.set('model', res);
        self.controller.set('modelSpinner', false);
      });
    }
  }

});
