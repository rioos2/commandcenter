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
  compute: Ember.computed.alias('model.assemblyfactory.resources.compute_type'),
  storageType: Ember.computed.alias('model.assemblyfactory.resources.storage_type'),
  network: Ember.computed.alias('model.assemblyfactory.network'),
  clusterName: Ember.computed.alias('model.assemblyfactory.object_meta.cluster_name'),
  resources: Ember.computed.alias('model.assemblyfactory.resources'),
  af: Ember.computed.alias('model.assemblyfactory'),


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

  distroChecker: function() {
    this.set("noImage", false);
  }.observes('model.assemblyfactory.os'),

  distroNameFromPlan: function() {
    if (this.get("model.assemblyfactory.os") == undefined) {
      this.set('noImage', true);
    } else {
      this.set('noImage', false);
    }
    return this.get("model.assemblyfactory.os");
  }.property('model.assemblyfactory.os'),

  regionExisit: function() {
    return Ember.isEmpty(this.get('clusterName'));
  }.property('clusterName'),

  countryExisit: function() {
    return Ember.isEmpty(this.get('model.assemblyfactory.country'));
  }.property('model.assemblyfactory.country'),

  networkExisit: function() {
    return Ember.isEmpty(this.get('network'));
  }.property('network'),

  imageExisit: function() {
    return Ember.isEmpty(this.get('model.assemblyfactory.os'));
  }.property('model.assemblyfactory.os'),

  validation() {
    if (Ember.isEmpty(this.get('model.assemblyfactory.secret.id'))) {
      this.set('validationWarning', get(this, 'intl').t('notifications.secret'));
      return true;
    } else if (this.get('regionExisit')) {
      this.set('validationWarning', get(this, 'intl').t('notifications.region'));
      return true;
    } else if (this.get('countryExisit')) {
      this.set('validationWarning', get(this, 'intl').t('notifications.country'));
      return true;
    } else if (Ember.isEmpty(this.get('model.assemblyfactory.os'))) {
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

  actions: {
    createAssemblyFactory() {
      if (!this.validation()) {
        this.set('filpper', "dive");
        this.set('showSpinner', true);
        var session = this.get("session");
        var id = this.get("session").get("id");
        this.set("model.assemblyfactory.object_meta.account", id);
        var url = 'accounts/' + id + '/assemblyfactorys';
        this.resourceUpdate();
        this.get('model.assemblyfactory').save(this.opts(url)).then(() => {
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
