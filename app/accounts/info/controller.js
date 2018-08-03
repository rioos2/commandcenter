import C from 'nilavu/utils/constants';
import Ember from 'ember';
const  { get } = Ember;

export default Ember.Controller.extend({
  notifications: Ember.inject.service('notification-messages'),
  intl:          Ember.inject.service(),

  img: function() {
    if (this.get('model.profile.avatar') == null) {
      return 'assets/images/user/default.png';
    }

    return `data:image/png;base64,${  this.get('model.profile.avatar') }`;
  }.property('model'),

  alertMessage: function() {
    if (this.get('model.logData.code') == '502') {
      this.get('notifications').warning(get(this, 'intl').t('auditLogsPage.connectionError'), {
        htmlContent:   true,
        autoClear:     true,
        clearDuration: 6000,
        cssClasses:    'notification-warning'
      });
    }
  }.observes('model.logData.code'),


  createdAt: function() {
    if (this.get('model.profile.created_at')) {
      return this.profileTimestamp(this.get('model.profile.created_at'));
    }

    return ' ';
  }.property('model'),

  memberShip: function() {
    if (this.get('model.profile.object_meta.labels.rioos_sh_membership')) {
      return this.get('model.profile.object_meta.labels.rioos_sh_membership');
    }

    return C.ACCOUNT.MEMBERSHIP.MEMBERSHIPTRAIL;
  }.property('model.profile.object_meta.labels.rioos_sh_membership'),

  memberShipStatus: function() {
    if (this.get('model.profile.object_meta.labels.rioos_sh_membership_status')) {
      return this.get('model.profile.object_meta.labels.rioos_sh_membership_status');
    }

    return C.ACCOUNT.MEMBERSHIPSTATUS.MEMBERSHIPSTATUSREGISTERED;
  }.property('model.profile.object_meta.labels.rioos_sh_membership_status'),

  tableData: function() {
    let data = this.get('model.logData.content');

    if (!Ember.isEmpty(data)) {
      data.forEach((e) => {
        if (e.envelope.timestamp) {
          e.envelope.timestamp = this.auditedTimestamp(e.envelope.timestamp);
        }
      });
    }

    return data;
  }.property('model.logData'),

  tableLastData: function() {
    if (!Ember.isEmpty(this.get('tableData'))) {
      return {
        show:    true,
        type:    'warning',
        message: (this.get('tableData').slice(-1)[0]).envelope.event.message
      };
    }

    return { show: false };
  }.property('tableData'),

  profileTimestamp(date) {
    return moment(date).utcOffset(date).format('MMM DD, YYYY').toString();
  },

  auditedTimestamp(date) {
    return moment(date).utcOffset(date).format('MMM DD YYYY, h:mm:ss a').toString();
  },

});
