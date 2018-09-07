import DefaultHeaders from 'nilavu/mixins/default-headers';
import { xhrConcur } from 'nilavu/utils/platform';
// import { get } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { Promise } from 'rsvp';
import EmberObject from '@ember/object';

export default Route.extend(DefaultHeaders, {

  access:  service(),
  session: service(),
  intl:    service(),

  model() {
    let promise = new Promise((resolve, reject) => {
      let tasks = {
        profile: this.cbFind('account', `accounts/${  this.get('session').get('id') }`),
        logData: this.cbFind('audit', 'audits'),
      };

      async.auto(tasks, xhrConcur, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    }, 'Load all the things');

    return promise.then((hash) => {
      return EmberObject.create({
        profile: hash.profile,
        logData: hash.logData,
      });
    }).catch(() => {
      return;
    });
  },

  afterModel(model) {
    if (!(model.profile.content === undefined)) {
      model.profile = model.profile.content[0];
    }

    return model;
  },

  cbFind(type, url) {
    return (results, cb) => {
      if (typeof results === 'function') {
        cb = results;
        results = null;
      }

      return this.get('store').find(type, null, this.opts(url)).then((res) => {
        cb(null, res);
      }).catch((err) => {
        cb(null, err);
      });
    };
  },

});
