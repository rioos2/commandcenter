import Resource from 'ember-api-store/models/resource';
const { get } = Ember;
import C from 'nilavu/utils/constants';

var Assembly = Resource.extend({

  type: 'assembly',
  lifecycle: Ember.inject.service('lifecycle'),
  router: Ember.inject.service(),
  intl: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),


  availableActions: function() {
    var a = this.get('actionLinks');
    return [{
        label: 'action.remove',
        icon: 'fa fa-trash-o',
        action: 'delete',
        enabled: true,
        altAction: 'delete',
        class: this.get('hasTerminated') ? 'disabled' : ' '
      },
      {
        label: 'action.console',
        icon: 'fa fa-terminal',
        action: 'console',
        enabled: true
      },
    ];
  }.property('id', 'actionLinks', 'hasTerminated', 'okay'),

  hasTerminated: function() {
    return C.MANAGEMENT.STATUS.TERMINATE.includes(this.get('status.phase').toLowerCase());
  }.property('status.phase'),


  host: function() {
    return this.get('metadata.rioos_sh_vnc_host') ? this.get('metadata.rioos_sh_vnc_host') : "";
  }.property('metadata.rioos_sh_vnc_host'),

  port: function() {
    return this.get('metadata.rioos_sh_vnc_port') ? this.get('metadata.rioos_sh_vnc_port') : "";
  }.property('metadata.rioos_sh_vnc_port'),

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
      }).catch((err) => {
        this.get('notifications').warning(get(this, 'intl').t('notifications.Stacks.DeleteFailed'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-warning'
        });
      });
    },

    console() {
      window.open(window.location.href + "/stack/console?vnchost=" + this.get('host') + "&vncport=" + this.get('port'), '_blank');
    },

  },

});

export default Assembly;
