import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

/*
*
* This mixin helps resolve hashSettled response data to our api response.
* It detects 502 error then infom to the UI henceforth 502 not breaking the UI anywhere.
*
*/
export default Mixin.create({

  notifications: service('notification-messages'),


  responseError(err) {

    if ( err.code === '502'){
      this.get('notifications').warning(err.message, {
        autoClear:     true,
        clearDuration: 5200,
        cssClasses:    'notification-warning'
      });
    }
  },

  responseHandler(hash) {

    var objectToResolve = {};

    Object.keys(hash).forEach((key) => {
      objectToResolve[key] = hash[key].state === 'fulfilled' ? hash[key].value : this.responseError(hash[key].reason);
    });

    return objectToResolve;
  }

});
