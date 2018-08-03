import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import Downloadjs from 'npm:downloadjs';
const  {get} = Ember;

export default Ember.Route.extend(DefaultHeaders, {

  intl:       Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),

  model: function(params) {
    const self = this;
    //TODO we should call store find to get single record.
    //this.get('store').getById("secret", params.id);
    return this.get('store').findAll('secret',this.opts('secrets')).then((reports) => {
      if(!this.secretDownload(reports.content, params.id)){
        this.get('notifications').warning(get(this, 'intl').t('notifications.secrets.downloadFailed'), {
          autoClear: true,
          clearDuration: 4200,
          cssClasses: 'notification-warning'
        });
      };
      this.transitionTo('authenticated');
    }).catch(function() {
      this.get('notifications').warning(get(this, 'intl').t('notifications.secrets.downloadFailed'), {
        autoClear: true,
        clearDuration: 4200,
        cssClasses: 'notification-warning'
      });
      this.transitionTo('authenticated');
    });
  },

  secretDownload: function(secrets, id) {
    var result = secrets.filter(function (s) {
       return s.id === id;
     });
     if (result.length != 0) {
       Downloadjs(result[0].data.rsa_key, id+".key", "text/plain");
       return true;
     }
     return false;
  },
});
