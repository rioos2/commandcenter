import DefaultHeaders from 'nilavu/mixins/default-headers';
import Downloadjs from 'downloadjs';
import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
export default Route.extend(DefaultHeaders, {

  intl:          service(),
  notifications: service('notification-messages'),

  model(params) {

    // TODO we should call store find to get single record.
    // this.get('store').getById("secret", params.id);
    return this.get('store').findAll('secret', this.opts('secrets')).then((reports) => {
      if (!this.secretDownload(reports.content, params.id)){
        this.get('notifications').warning(get(this, 'intl').t('notifications.secrets.downloadFailed'), {
          autoClear:     true,
          clearDuration: 4200,
          cssClasses:    'notification-warning'
        });
      }
      this.transitionTo('authenticated');
    }).catch(function() {
      this.get('notifications').warning(get(this, 'intl').t('notifications.secrets.downloadFailed'), {
        autoClear:     true,
        clearDuration: 4200,
        cssClasses:    'notification-warning'
      });
      this.transitionTo('authenticated');
    });
  },

  secretDownload(secrets, id) {
    var result = secrets.filter((s) => {
      return s.id === id;
    });

    if (result.length !== 0) {
      Downloadjs(result[0].data.rsa_key, `${ id }.key`, 'text/plain');

      return true;
    }

    return false;
  },
});
