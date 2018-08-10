import Resource from 'ember-api-store/models/resource';
import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { htmlSafe } from '@ember/string';
import { inject as service } from '@ember/service';
import C from 'nilavu/utils/constants';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import Downloadjs from 'npm:downloadjs';

var Assembly = Resource.extend(DefaultHeaders, {

  availableActions: function() {

    return [{
      label:     'action.remove',
      icon:      'fa fa-trash-o',
      action:    'deletePromt',
      enabled:   true,
      altAction: 'delete',
      class:     this.get('hasTerminated') ? 'disabled' : ' '
    },
    {
      label:   'action.console',
      icon:    'fa fa-terminal',
      action:  'console',
      enabled: true,
      class:   (this.get('enableConsole') || this.get('hasTerminated') || this.get('hasFailed')) ? 'disabled' : ' '

    },
    {
      label:   'action.downloadSecret',
      icon:    'fa fa-download',
      action:  'download',
      enabled: true,
    },
    {
      label:   'action.externalUrl',
      icon:    'fa fa-external-link',
      action:  'applicationUrl',
      enabled: this.linkEnabler(),
    },
    ];
  }.property('id', 'actionLinks', 'hasTerminated', 'status.phase', 'enableConsole'),

  hasTerminated: function() {
    return C.MANAGEMENT.STATUS.TERMINATE.includes(this.get('status.phase').toLowerCase());
  }.property('status.phase'),

  hasFailed: function() {
    return C.MANAGEMENT.STATUS.FAILURE.includes(this.get('status.phase').toLowerCase());
  }.property('status.phase'),

  categorieType: function() {
    return C.MANAGEMENT.STATUS.TERMINATE.includes(this.get('status.phase').toLowerCase());
  }.property('spec.assembly_factory.spec.plan.category'),

  host: function() {
    return this.get('metadata.rioos_sh_vnc_host') ? this.get('metadata.rioos_sh_vnc_host') : '';
  }.property('metadata.rioos_sh_vnc_host'),

  port: function() {
    return this.get('metadata.rioos_sh_vnc_port') ? this.get('metadata.rioos_sh_vnc_port') : '';
  }.property('metadata.rioos_sh_vnc_port'),

  enableConsole: function() {
    return isEmpty(this.get('host')) || isEmpty(this.get('port'));
  }.property('host', 'port'),

  name: function() {
    return this.get('object_meta.name') ? this.get('object_meta.name') : '';
  }.property('object_meta.name'),

  type:          'assembly',
  lifecycle:     service('lifecycle'),
  router:        service(),
  intl:          service(),
  notifications: service('notification-messages'),
  modalService:  service('modal'),
  session:       service(),
  enableLink:    false,


  hasDownloaded(secrets, id) {
    if (secrets.length !== 0) {
      Downloadjs(secrets, `${ id  }.key`, 'text/plain');

      return true;
    }

    return false;
  },

  downloadAndWarnIfNone(res) {
    let key = res.data['rioos_sh/ssh_pubkey'] || '';

    if (!this.hasDownloaded(key, this.get('name'))) {
      this.get('notifications').warning(htmlSafe(get(this, 'intl').t('notifications.secrets.manageDownloadFailed')), {
        autoClear:     true,
        clearDuration: 4200,
        cssClasses:    'notification-success'
      });
    }
  },

  applicationUrlData() {
    let ip = !isEmpty(this.get('spec.endpoints.subsets.addresses')) ? this.get('spec.endpoints.subsets.addresses')[0].ip : '';

    if (ip) {
      let planBlueprintId = this.get('spec.assembly_factory.metadata.rioos_sh_blueprint_applied');
      let port = '';
      let protocol = '';

      if (planBlueprintId) {
        this.get('spec.assembly_factory.spec.plan.plans').forEach((p) => {
          if (p.object_meta.name === planBlueprintId) {
            port = p.metadata.rioos_sh_web_access_port;
            protocol = p.metadata.rioos_sh_web_access_protocal;
            if (protocol && port) {
              this.set('enableLink', true);
            }
          }
        });
      }
      let url = `${ protocol  }://${  ip  }:${  port }`;

      this.set('url', url);
    }
  },

  linkEnabler() {
    this.applicationUrlData();

    return this.get('enableLink');
  },


  actions: {
    delete() {
      let date = new Date();

      this.set('object_meta.deleted_at', date.toString());
      this.get('lifecycle').delete(this.get('id'), this).then(() => {
        this.get('notifications').info(`${ this.get('name')  } ${  get(this, 'intl').t('notifications.Stacks.DeleteSuccess') }`, {
          autoClear:     true,
          clearDuration: 3200,
          cssClasses:    'notification-success'
        });
        this.set('hasTerminated', true);
        this.get('modalService').toggleModal();
      }).catch(() => {
        this.get('notifications').warning(get(this, 'intl').t('notifications.Stacks.DeleteFailed'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      });
    },

    showQRcode() {
      var self = this;

      if (!isEmpty(this.get('SecretData'))) {
        let key = this.get('SecretData').data['rioos_sh_kryptonite_qrcode'] || '';

        this.set('rioos_sh_kryptonite_qrcode', key);
        this.get('modalService').toggleModal('modal-show-qrcode', this);
      } else {
        self.get('notifications').warning(get(self, 'intl').t('notifications.QRcode.downloadFailed'), {
          autoClear:      true,
          clearDuration:  4200,
          cssClasses:     'notification-warning'
        });
      }
    },

    download() {
      var self = this;

      return this.get('store').find('secret', null, this.opts(`secrets/${  this.get('spec.assembly_factory.secret.id') }`, true)).then((res) => {
        self.downloadAndWarnIfNone(res);
      }).catch(() => {
        self.get('notifications').warning(get(self, 'intl').t('notifications.secrets.downloadFailed'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      });
    },

    console() {
      let type = this.get('spec.assembly_factory.spec.plan.category');

      switch (type) {
      case C.CATEGORIES.MACHINE:
        window.open(`${ location.protocol  }//${  location.host  }${ location.pathname  }/stack/console?vnchost=${  this.get('host')  }&vncport=${  this.get('port') }`, '_blank');
        break;
      case C.CATEGORIES.CONTAINER:
        window.open(`${ location.protocol  }//${  location.host  }${ location.pathname  }/stack/containerconsole?vnchost=${  this.get('host')  }&account_id=${  this.get('session').get('id')  }&id=${  this.get('id') }`, '_blank');
        break;
      }

    },

    deletePromt() {
      this.get('modalService').toggleModal('modal-confirm-delete', this);
    },

    applicationUrl() {
      window.open(this.get('url'));
    },

  },

});

export default Assembly;
