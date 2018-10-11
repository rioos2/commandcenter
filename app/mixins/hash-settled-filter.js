import Mixin from '@ember/object/mixin';

/*
*
* This mixin helps resolve hashSettled response data to our api response.
*
*/
export default Mixin.create({


  responseHandler(hash) {

    var objectToResolve = {};

    Object.keys(hash).forEach((key) => {
      objectToResolve[key] = hash[key].state === 'fulfilled' ? hash[key].value : hash[key].reason;
    });

    return objectToResolve;
  }

});
