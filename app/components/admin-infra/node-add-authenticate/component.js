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

  didInsertElement: function() {
    // $("#node_auth_" + this.get('model.id')).val('Password');
    // $("#node_auth_" + this.get('model.id')).trigger('change');
  },

  types: function() {
    return C.NODE.NODEAUTHTYPE;
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
    if (Ember.isEmpty(this.get('nodeusername'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.node.enterUsername'));
    }

    if (Ember.isEmpty(this.get('nodepwd'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.node.enterPassword'));
    }

    this.set('validationWarning', validationString);
    return Ember.isEmpty(this.get('validationWarning')) ? false : true;
  },

  validationSsh() {
    this.set('validationWarning', "");
    var validationString = "";
    if (Ember.isEmpty(this.get('sshvalue'))) {
      validationString = validationString.concat(get(this, 'intl').t('stackPage.admin.node.enterSshKey'));
    }

    this.set('validationWarning', validationString);
    return Ember.isEmpty(this.get('validationWarning')) ? false : true;
  },

  actions: {

    selectAuthType: function(type) {
      this.set('authType', type);
    },

    doDiscovery(secret, error) {
      this.set('showSpinner', true);
      if (!error) {
        this.get('userStore').rawRequest(this.rawRequestOpts({
          url: '/api/v1/accounts/' + this.get('session').get("id") + '/secrets',
          method: 'POST',
          data: secret,
        })).then((xhr) => {
          this.get('notifications').info(get(this, 'intl').t('stackPage.admin.node.nodeSecretCreate'), {
            autoClear: true,
            clearDuration: 4200,
            cssClasses: 'notification-success'
          });
          this.set('showSpinner', false);
          this.send("installNode", xhr.body.id);
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
      node.status.phase = "Pending";
      // node.id = '';
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

    createSecret() {
      let secret = this.loadSecret("opaque");
      switch (this.get('authType')) {
        case 'SSH':
          if (!this.validationSsh()) {
            secret.data['rioos_sh/ssh_pubkey'] = this.get('sshvalue');
            this.send('doDiscovery', secret, false);
          } else {
            this.send('doDiscovery', secret, true);
          }
          break;
        case 'Password':
          if (!this.validationUserPwd()) {
            secret.data.rioos_sh_node_sudo_user = this.get('nodeusername');
            secret.data.rioos_sh_node_password = this.get('nodepwd');
            this.send('doDiscovery', secret, false);
          } else {
            this.send('doDiscovery', secret, true);
          }
          break;
      }
    },

  },

});
