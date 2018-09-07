import DefaultHeaders from 'nilavu/mixins/default-headers';
import { xhrConcur } from 'nilavu/utils/platform';
import Ember from 'ember';
const { get } = Ember;


export default Ember.Route.extend(DefaultHeaders, {

  access:  Ember.inject.service(),
  session: Ember.inject.service(),
  intl:    Ember.inject.service(),

  model() {
    let promise = new Ember.RSVP.Promise((resolve, reject) => {
      let tasks = {
        profile: this.cbFind('account', `accounts/${  this.get('session').get('id') }`),
        logData: this.cbFind('audit', `accounts/${  this.get('session').get('id')  }/audits`),
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
      return Ember.Object.create({
        profile: hash.profile,
        logData: hash.logData,
      });
    }).catch((err) => {
      return;
    });
  },

  afterModel(model) {
    if (!(model.profile.content == undefined)) {
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
