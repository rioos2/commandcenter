/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';


export default Ember.Component.extend({
  activate: false,
  store: Ember.inject.service(),

  initializeChart: Ember.on('didInsertElement', function() {
    var self = this;
    self.sendAction('done', "step5");
    self.$(".btn-version").click(function(e) {
      self.$(".btn-version").removeClass("active");
      self.$(this).addClass("active");
    });
  }),


  groupedVms: function() {
    var planGroup = [];
    var uniqueVmGroup = [];
    var groupVms = [];
    var planfactory = this.get("model.plans.content");
    planfactory.pushObject(
      {
"id":"872338390278742016",
"type_meta":{
"kind":"PlanFactory",
"api_version":"v1"
},
"object_meta":{
"name":"fedora",
"account":"",
"created_at":"",
"deleted_at":"",
"deletion_grace_period_seconds":"",
"labels":{
},
"annotations":{
},
"owner_references":[
{
"kind":"",
"api_version":"",
"name":"",
"uid":"",
"block_owner_deletion":false
}
],
"initializers":{
},
"finalizers":[
],
"cluster_name":""
},
"category":"machine",
"version":"4.04",
"characteristics":{
"extension":"raw"
},
"icon":"ubuntu.png",
"description":"Ubuntu is a Debian-based Linux operating system. Trusty Tahr is the Ubuntu codename for version 14.04 LTS of the Ubuntu Linux-based operating system",
"ports":[
],
"envs":{
},
"lifecycle":{
},
"status":{
"phase":"ready",
"message":"",
"reason":"",
"conditions":[
{
"condition_type":"",
"message":"",
"reason":"",
"status":"ready",
"last_update_time":"",
"last_transition_time":"",
"last_probe_time":""
}
]
},
"created_at":"",
"kind":"planfactory",
"type":"planfactory"
},
    );
    planfactory.pushObject(      {
    "id":"872338390278742016",
    "type_meta":{
    "kind":"PlanFactory",
    "api_version":"v1"
    },
    "object_meta":{
    "name":"ubuntu",
    "account":"",
    "created_at":"",
    "deleted_at":"",
    "deletion_grace_period_seconds":"",
    "labels":{
    },
    "annotations":{
    },
    "owner_references":[
    {
    "kind":"",
    "api_version":"",
    "name":"",
    "uid":"",
    "block_owner_deletion":false
    }
    ],
    "initializers":{
    },
    "finalizers":[
    ],
    "cluster_name":""
    },
    "category":"machine",
    "version":"16.04",
    "characteristics":{
    "extension":"raw"
    },
    "icon":"ubuntu.png",
    "description":"Ubuntu is a Debian-based Linux operating system. Trusty Tahr is the Ubuntu codename for version 14.04 LTS of the Ubuntu Linux-based operating system",
    "ports":[
    ],
    "envs":{
    },
    "lifecycle":{
    },
    "status":{
    "phase":"ready",
    "message":"",
    "reason":"",
    "conditions":[
    {
    "condition_type":"",
    "message":"",
    "reason":"",
    "status":"ready",
    "last_update_time":"",
    "last_transition_time":"",
    "last_probe_time":""
    }
    ]
    },
    "created_at":"",
    "kind":"planfactory",
    "type":"planfactory"
    },);

    planfactory.forEach(function(plan) {
      if (plan.category == "machine" && plan.status.phase == "ready") {
        planGroup.pushObject(plan.object_meta.name);
      }
      uniqueVmGroup = planGroup.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
      })
    });
    uniqueVmGroup.forEach(function(vm) {
      let createVmGroup = {
        "type": vm,
        "version": [],
        "item": []
      }
      planfactory.forEach(function(plan) {
        if (plan.object_meta.name == vm) {
          createVmGroup.item.pushObject(plan);
          createVmGroup.version.pushObject({
            "version": plan.version,
            "id": plan.id,
            "type": plan.object_meta.name
          });
        }
      })
      groupVms.pushObject(createVmGroup);
      createVmGroup = {};
    })
    return groupVms;
  }.property('model.plans'),

  indexReader: function() {
    var types = this.get('groupedVms').map(function(vm) {
      return vm.type
    })
    return types.indexOf(this.get('selected.type'));
  },

  actions: {

    refreshAfterSelect(item) {
      this.sendAction('done', "step5");
      this.set("selected", item);
      this.set("model.assemblyfactory.os", item.type);
      this.toggleProperty('activate');
    },

    navigatorRight() {
      var index = this.indexReader();
      if (index < ((this.get('groupedVms')).length) - 1) {
        this.send('refreshAfterSelect', this.get('groupedVms')[index + 1]);
      }
    },

    navigatorLeft() {
      var index = this.indexReader();
      if (!index == 0) {
        this.send('refreshAfterSelect', this.get('groupedVms')[index - 1]);
      }
    },
  }


});
