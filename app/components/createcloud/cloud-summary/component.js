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
    var self=this;
    this.set('model.buildconfig.object_meta.cluster_name', result.object_meta.cluster_name);
    if(!Ember.isEmpty(result.spec.plan.meta_data.rioos_sh_blockchain_network)){
      this.set('model.buildconfig.spec.strategy.build_type', result.spec.plan.metadata.rioos_sh_blockchain_network);
    }
      if(!Ember.isEmpty(result.spec.assembly_factory)){
        result.spec.assembly_factory.map(function(assemblyfactory){
          if(!Ember.isEmpty(assemblyfactory.spec.plan) && !Ember.isEmpty(result.spec.plan)){
            if(Ember.isEqual(assemblyfactory.spec.plan.category, result.spec.plan.category)){
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
              alert("errr");
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
