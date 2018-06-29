/* global renderChartNumberOfCores, renderChartRam, renderChartLinearProgressSlider*/
import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';
const {
  get
} = Ember;
import C from 'nilavu/utils/constants';


export default Ember.Component.extend(DefaultHeaders, {
  session: Ember.inject.service(),
  intl: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  noImage: true,
  validationWarning: '',
  networkExist: true,

  domainName: "",
  compute: Ember.computed.alias('model.stacksfactory.resources.compute_type'),
  storageType: Ember.computed.alias('model.stacksfactory.resources.storage_type'),
  network: Ember.computed.alias('model.stacksfactory.network'),
  clusterName: Ember.computed.alias('model.stacksfactory.object_meta.cluster_name'),
  resources: Ember.computed.alias('model.stacksfactory.resources'),
  af: Ember.computed.alias('model.stacksfactory'),


  isSelectedCPU: function() {
    return this.get('compute') === C.VPS.RESOURSE_COMPUTE_TYPE.CPU;
  }.property('compute'),

  isSelectedFlash: function() {
    return this.get('storageType') === C.VPS.RESOURSE.SSD;
  }.property('storageType'),

  isIPv4: function() {
    return this.get('network').includes('ipv4');
  }.property('network'),

  isPrivate: function() {
    return this.get('network').includes('private');
  }.property('network'),

  _didInsert: function() {
    this.set("summaryContent", this);
  }.on("didInsertElement"),

  icon: function() {
    return this.get('model.selected_icon');
  }.property('model.selected_icon'),

  distroChecker: function() {
    this.set("noImage", false);
  }.observes('model.stacksfactory.os'),

  distroNameFromPlan: function() {
    if (this.get("model.stacksfactory.os") == undefined) {
      this.set('noImage', true);
    } else {
      this.set('noImage', false);
    }
    return this.get("model.stacksfactory.os");
  }.property('model.stacksfactory.os'),

  regionExisit: function() {
    return Ember.isEmpty(this.get('clusterName'));
  }.property('clusterName'),

  // countryExisit: function() {
  //   return Ember.isEmpty(this.get('model.assemblyfactory.country'));
  // }.property('model.assemblyfactory.country'),

  networkExisit: function() {
    return Ember.isEmpty(this.get('network'));
  }.property('network'),

  imageExisit: function() {
    return Ember.isEmpty(this.get('model.stacksfactory.os'));
  }.property('model.stacksfactory.os'),

  blockchainNetworkAvailable: function() {
    return (Ember.isEmpty(this.get('model.stacksfactory.metadata.rioos_sh_blockchain_network_id')) && Ember.isEqual(this.get('model.stacksfactory.object_meta.labels.rioos_category'), C.CATEGORIES.BLOCKCHAIN_TEMPLATE)) ? true : false;
  }.property('model.stacksfactory.metadata.rioos_sh_blockchain_network_id'),

  setResource: function(resource) {
    if (!Ember.isEmpty(this.get('model.hscaling.target_value.max_target_value_' + `${resource}`)) || !Ember.isEmpty(this.get('model.hscaling.target_value.min_target_value_' + `${resource}`))) {
      this.get('model.hscaling.spec.metrics').pushObject({
        metric_type: "Resource",
        "resource": {
          "name": resource,
          "max_target_value": this.get('model.hscaling.target_value.max_target_value_' + `${resource}`).toString(),
          "min_target_value": this.get('model.hscaling.target_value.min_target_value_' + `${resource}`).toString(),
          "metric_time_spec": {
            "scale_up_by": "1",
            "scale_down_by": "1"
          }
        }
      });
    }
  },
  scalingApplied: function() {
    return this.get('model.hscaling.scaling_rule_apply');
  },

  scalingExist: function() {
    return (!Ember.isEmpty(this.get('model.hscaling'))) ? (this.get('model.hscaling.scaling_rule_apply') ? !(this.get('model.hscaling.target_value.min_target_value_cpu') >0 && this.get('model.hscaling.target_value.max_target_value_cpu')> 0 ||
        this.get('model.hscaling.target_value.min_target_value_memory') >0 && this.get('model.hscaling.target_value.max_target_value_memory')> 0 ||
        this.get('model.hscaling.target_value.min_target_value_disk') >0 && this.get('model.hscaling.target_value.max_target_value_disk')> 0 ) : false ) : false;
  }.property('model.scaling','model.hscaling.scaling_rule_apply','model.hscaling.target_value.min_target_value_cpu','model.hscaling.target_value.max_target_value_cpu','model.hscaling.target_value.min_target_value_memory','model.hscaling.target_value.max_target_value_memory','model.hscaling.target_value.min_target_value_disk','model.hscaling.target_value.max_target_value_disk'),

  scalingResourceExist: function() {
    var self = this;
    if (Ember.isEqual(this.get('model.object_meta.labels.rioos_category')), C.CATEGORIES.CONTAINER) {
      this.set('model.hscaling.spec.metrics', []);
      C.RESOURCES.map(function(resource) {
        self.setResource(resource);
      });
    }
  },

  validation() {
    if (Ember.isEmpty(this.get('model.stacksfactory.secret.id')) && this.get('model.stacksfactory.object_meta.labels.rioos_category') != C.CATEGORIES.BLOCKCHAIN) {
      this.set('validationWarning', get(this, 'intl').t('notifications.secret'));
      return true;
    } else if (this.get('blockchainNetworkAvailable')) {
      this.set('validationWarning', get(this, 'intl').t('notifications.blockchainnetwork'));
      return true;
    } else if (this.get('regionExisit')) {
      this.set('validationWarning', get(this, 'intl').t('notifications.region'));
      return true;
    } else if (Ember.isEmpty(this.get('model.stacksfactory.os'))) {
      this.set('validationWarning', get(this, 'intl').t('notifications.plan.noSelection'));
      return true;
    } else if (this.get('networkExisit')) {
      this.set('validationWarning', get(this, 'intl').t('notifications.network.noSelection'));
      return true;
    } else if (this.get('scalingExist')) {
      this.set('validationWarning', get(this, 'intl').t('notifications.scaling.noSelection'));
      return true;
    } else {
      return false;
    }
  },

  resourceUpdate() {
    this.set("resources.cpu", this.get("resources.cpu").toString());
    this.set("resources.storage", this.get("resources.storage") + get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.suffix-i'));
    this.set("resources.memory", this.get("resources.memory") + get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.suffix-i'));

  },

  ram: function() {
    return this.gibFormater(this.get("resources.memory").toString()) + get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.suffix');
  }.property('resources.memory'),

  storage: function() {
    return this.gibFormater(this.get("resources.storage").toString()) + get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.suffix');
  }.property('resources.storage'),

  gibFormater: function(data) {
    return data.replace(get(this, 'intl').t('launcherPage.sysConfig.storageCapacity.suffix-i'), '');
  },

  createBuildConfig: function(result) {

    var self = this;
    this.set('model.buildconfig.object_meta.cluster_name', result.object_meta.cluster_name);
    if (!Ember.isEmpty(result.spec.plan.meta_data.rioos_sh_blockchain_network)) {
      this.set('model.buildconfig.spec.strategy.build_type', result.spec.plan.metadata.rioos_sh_blockchain_network);
    }
    if (!Ember.isEmpty(result.spec.assembly_factory)) {
      result.spec.assembly_factory.map(function(assemblyfactory) {
        if (!Ember.isEmpty(assemblyfactory.spec.plan) && !Ember.isEmpty(result.spec.plan)) {
          if (Ember.isEqual(assemblyfactory.spec.plan.category, result.spec.plan.category)) {
            self.get('model.buildconfig.object_meta.owner_references').map(function(owner) {
              owner.name = result.object_meta.name;
              owner.uid = result.id;
            });
          }
        }
      })
    }
    if (!Ember.isEmpty(this.get('model.buildconfig.spec.build_trigger_policys'))) {
      this.get('model.buildconfig.spec.build_trigger_policys').map(function(build) {
        build.webhook.secret = result.secret.id;
      });
    }
    this.set('model.buildconfig.spec.source.source_secret', result.secret.id);
  },

  createHorizontalScaling: function(stacksfactory) {
    var self = this;
    this.scalingResourceExist();
    if (!Ember.isEmpty(stacksfactory.spec.assembly_factory)) {
      var hs_url = 'horizontalscaling';
      stacksfactory.spec.assembly_factory.map(function(assemblyfactory) {
        self.get('model.hscaling.object_meta.owner_references').map(function(owner) {
          owner.kind = "AssemblyFactory";
          owner.api_version = "v1";
          owner.name = assemblyfactory.object_meta.name;
          owner.uid = assemblyfactory.id;
        });
        self.get('model.hscaling').save(self.opts(hs_url)).then(() => {
          self.get('notifications').info(get(this, 'intl').t('launcherPage.hscaling.success'), {
            autoClear: true,
            clearDuration: 4200,
            cssClasses: 'notification-success'
          });
          self.set('showSpinner', false);
        }).catch(err => {
          self.get('notifications').warning(get(this, 'intl').t('notifications.failedHScaling'), {
            autoClear: true,
            clearDuration: 4200,
            cssClasses: 'notification-warning'
          });
        });
      });
    }
  },

  actions: {
    createStacksFactory() {
      if (!this.validation()) {
        this.set('filpper', "dive");
        this.set('showSpinner', true);
        var session = this.get("session");
        var id = this.get("session").get("id");
        this.set("model.stacksfactory.object_meta.account", id);
        var url = 'accounts/' + id + '/stacksfactorys';
        var build_url = 'buildconfigs';
        this.resourceUpdate();
        this.get('model.stacksfactory').save(this.opts(url)).then((result) => {
          if (result.object_meta.labels.rioos_category == C.CATEGORIES.CONTAINER) {
            if (this.scalingApplied()) {
              this.set("model.hscaling.object_meta.account", id);
              this.createHorizontalScaling(result);
            }
          }
          if (result.object_meta.labels.rioos_category == C.CATEGORIES.BLOCKCHAIN_TEMPLATE) {
            this.createBuildConfig(result);
            this.get('model.buildconfig').save(this.opts(build_url)).then(() => {
              this.get('notifications').info(get(this, 'intl').t('launcherPage.buildconfig.success'), {
                autoClear: true,
                clearDuration: 4200,
                cssClasses: 'notification-success'
              });
              this.set('showSpinner', false);
            }).catch(err => {
              this.get('notifications').warning(get(this, 'intl').t('notifications.failedBuildConfig'), {
                autoClear: true,
                clearDuration: 4200,
                cssClasses: 'notification-warning'
              });
            });
          }
          // this.get('router').transitionTo('/apps/stacks');
          window.location = "/apps/stacks";
        }).catch(err => {
          this.set('filpper', "");
          this.get('notifications').warning(get(this, 'intl').t('notifications.failedLaunch'), {
            autoClear: true,
            clearDuration: 4200,
            cssClasses: 'notification-warning'
          });
          this.set('showSpinner', false);
        });
      } else {
        this.set('filpper', "");
        this.set('showSpinner', false);
        this.get('notifications').warning(this.get('validationWarning'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-warning'
        });
      }
    },
  }


});
