import Ember from 'ember';
const {
  get
} = Ember;
import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import ObjectMetaBuilder from 'nilavu/models/object-meta-builder';
export default Ember.Component.extend(DefaultHeaders, {
  intl: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  session: Ember.inject.service(),

  types: function() {
    return C.NODE.NODEAUTHTYPE;
  }.property('model'),

  sshplaceholder: function() {
    return get(this, 'intl').t('stackPage.admin.node.sshPlaceholder');
  }.property('model'),

  loadSecret(type) {
    var secretData = {
      type: 'secret',
      secret_type: type,
      data: {},
      object_meta: ObjectMetaBuilder.buildObjectMeta(),
      metadata: {},
    };

    return this.get('store').createRecord(secretData);
  },

  validationUserPwd() {
    this.set('validationWarning', "");
    var validationString = "";
    if (Ember.isEmpty(this.get('userName'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.node.enterUsername'));
    }

    if (Ember.isEmpty(this.get('password'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.node.enterPassword'));
    }

    this.set('validationWarning', validationString);
    return Ember.isEmpty(this.get('validationWarning')) ? false : true;
  },

  validationSsh() {
    this.set('validationWarning', "");
    var validationString = "";

    if (Ember.isEmpty(this.get('sshUserName'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.node.enterUsername'));
    }

    if (Ember.isEmpty(this.get('sshPrivateKey'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.node.enterSshKey'));
    }

    this.set('validationWarning', validationString);
    return Ember.isEmpty(this.get('validationWarning')) ? false : true;
  },

  refresh() {
    this.setProperties({
      userName: '',
      password: '',
      sshUserName: '',
      sshPrivateKey: '',
    });
  },

  actions: {

    selectAuthType: function(type) {
      this.set('authType', type);
    },

    installOrRetry(secret, error) {
      this.set('showSpinner', true);
      if (!error) {
        this.get('userStore').rawRequest(this.rawRequestOpts({
          url: '/api/v1/secrets',
          method: 'POST',
          data: secret,
        })).then((xhr) => {
          this.get('notifications').info(get(this, 'intl').t('stackPage.admin.node.nodeSecretCreate'), {
            autoClear: true,
            clearDuration: 4200,
            cssClasses: 'notification-success'
          });
          this.set('showSpinner', false);
          if(this.get('model.nodeOperation').includes('install')){
            this.send("installNode", xhr.body.id);
          } else {
            this.send("retryInstallNode", xhr.body.id);
          }
          this.refresh();
        }).catch((err) => {
          this.set('showSpinner', false);
        });
      } else {
        this.set('showSpinner', false);
        this.get('notifications').warning(Ember.String.htmlSafe(this.get('validationWarning')), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-warning'
        });
      }
    },

    installNode(secretId) {
      var self = this;
      let node = this.get('model');
      node.metadata = {};
      node.metadata.rioos_sh_node_secret_id = secretId;
      node.metadata.rioos_sh_ninja_rioconfig_name = "ninja";
      node.status.phase = "Pending";
      delete node.id;
      node.object_meta.labels.available_resource = "compute ninja"
      node.spec.unschedulable = true
      this.get('userStore').rawRequest(this.rawRequestOpts({
        url: '/api/v1/nodes',
        method: 'POST',
        data: node,
      })).then((result) => {
        this.get('notifications').info(get(this, 'intl').t('stackPage.admin.node.nodeCreate'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-success'
        });
        this.set('showSpinner', false);
        this.sendAction('doReload');
        $('#node_auth_modal_'+this.get('model.id')).modal('hide');
      }).catch(err => {
        this.get('notifications').warning(get(this, 'intl').t('stackPage.admin.node.nodeFailed'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-warning'
        });
        this.set('showSpinner', false);
      });
    },


    retryInstallNode(secretId) {
      let node = this.get('model');
      node.metadata.rioos_sh_node_secret_id = secretId;
      this.get('userStore').rawRequest(this.rawRequestOpts({
        url: '/api/v1/nodes/' + this.get('model.id'),
        method: 'PUT',
        data: node,
      })).then((result) => {
        this.get('notifications').info(get(this, 'intl').t('stackPage.admin.node.nodeRetry'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-success'
        });
        this.set('showSpinner', false);
        this.sendAction('doReload');
        $('#node_auth_modal_'+this.get('model.id')).modal('hide');
      }).catch(err => {
        this.get('notifications').warning(get(this, 'intl').t('stackPage.admin.node.nodeRetryFailed'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-warning'
        });
        this.set('showSpinner', false);
      });
    },

    createSecret() {
      let secret = this.loadSecret("opaque");
      switch (this.get('authType')) {
        case C.NODE.NODEAUTHTYPE[1]:
          if (!this.validationSsh()) {
            secret.data[C.SECRETS.KEYS.PRIVATE] = this.get('sshPrivateKey');
            secret.data.rioos_sh_node_sudo_user = this.get('sshUserName');
            this.send('installOrRetry', secret, false);
          } else {
            this.send('installOrRetry', secret, true);
          }
          break;
        case C.NODE.NODEAUTHTYPE[0]:
          if (!this.validationUserPwd()) {
            secret.data.rioos_sh_node_sudo_user = this.get('userName');
            secret.data.rioos_sh_node_password = this.get('password');
            this.send('installOrRetry', secret, false);
          } else {
            this.send('installOrRetry', secret, true);
          }
          break;
      }
    },

  },

});
