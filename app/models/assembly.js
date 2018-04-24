import Resource from 'ember-api-store/models/resource';
const {
  get
} = Ember;
import C from 'nilavu/utils/constants';

var Assembly = Resource.extend({

  type: 'assembly',
  lifecycle: Ember.inject.service('lifecycle'),
  router: Ember.inject.service(),
  intl: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  modalService: Ember.inject.service('modal'),


  availableActions: function() {
    var a = this.get('actionLinks');
    return [{
        label: 'action.remove',
        icon: 'fa fa-trash-o',
        action: 'deletePromt',
        enabled: true,
        altAction: 'delete',
        class: this.get('hasTerminated') ? 'disabled' : ' '
      },
      {
        label: 'action.console',
        icon: 'fa fa-terminal',
        action: 'console',
        enabled: true,
        class: (this.get('enableConsole') || this.get('hasTerminated') || this.get('hasFailed')) ? 'disabled' : ' '

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
    if (this.get('spec.assembly_factory.spec.plan.category') == C.CATEGORIES.CONTAINER) {
      return this.get('spec.assembly_factory.spec.plan.ports') ? this.get('spec.assembly_factory.spec.plan.ports')[0].host_ip : "";
    }
    return this.get('metadata.rioos_sh_vnc_host') ? this.get('metadata.rioos_sh_vnc_host') : "";
  }.property('metadata.rioos_sh_vnc_host', 'spec.assembly_factory.spec.plan.ports.@each.{host_ip}'),

  port: function() {
    if (this.get('spec.assembly_factory.spec.plan.category') == C.CATEGORIES.CONTAINER) {
      return this.get('spec.assembly_factory.spec.plan.ports') ? this.get('spec.assembly_factory.spec.plan.ports')[0].container_port : "";
    }
    return this.get('metadata.rioos_sh_vnc_port') ? this.get('metadata.rioos_sh_vnc_port') : "";
  }.property('metadata.rioos_sh_vnc_port', 'spec.assembly_factory.spec.plan.ports.@each.{container_port}'),

  enableConsole: function() {
    return Ember.isEmpty(this.get('host')) || Ember.isEmpty(this.get('port'));
  }.property('host', 'port'),

  name: function() {
    return this.get('object_meta.name') ? this.get('object_meta.name') : "";
  }.property('object_meta.name'),

  actions: {
    delete() {
      let date = new Date();
      this.set('object_meta.deleted_at', date.toString());
      this.get('lifecycle').delete(this.get('id'), this).then(() => {
        this.get('notifications').info(this.get('name') + " " + get(this, 'intl').t('notifications.Stacks.DeleteSuccess'), {
          autoClear: true,
          clearDuration: 3200,
          cssClasses: 'notification-success'
        });
        this.set('hasTerminated', true);
        this.get('modalService').toggleModal();
      }).catch((err) => {
        this.get('notifications').warning(get(this, 'intl').t('notifications.Stacks.DeleteFailed'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-warning'
        });
      });
    },

    console() {
      let type = this.get('spec.assembly_factory.spec.plan.category');
      switch (type) {
        case C.CATEGORIES.MACHINE:
          window.open(location.protocol + '//' + location.host + location.pathname + "/stack/console?vnchost=" + this.get('host') + "&vncport=" + this.get('port'), '_blank');
          break;
        case C.CATEGORIES.CONTAINER:
          window.open(location.protocol + '//' + location.host + location.pathname + "/stack/containerconsole?vnchost=" + this.get('host') + "&vncport=" + this.get('port') + "&id=" + this.get('id'), '_blank');
          break;
      }

    },

    deletePromt: function() {
      this.get('modalService').toggleModal('modal-confirm-delete', this);
    },

  },

});

export default Assembly;
