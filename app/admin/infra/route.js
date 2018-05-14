import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import {
  xhrConcur
} from 'nilavu/utils/platform';
const { get} = Ember;


export default Ember.Route.extend(DefaultHeaders, {

  access: Ember.inject.service(),
  session: Ember.inject.service(),
  intl:       Ember.inject.service(),

  model() {
    let promise = new Ember.RSVP.Promise((resolve, reject) => {
      let tasks = {
        storageConnectors: this.cbFind('storageconnectors','storageconnectors'),
        storagesPool: this.cbFind('storageconnectors','storagespool'),
        datacenters: this.cbFind('datacenters','datacenters'),
        networks: this.cbFind('networks','networks'),
      };
      async.auto(tasks, xhrConcur, function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    }, 'Load all the things');
    return promise.then((hash) => {
      return Ember.Object.create({
        storageConnectors: hash.storageConnectors,
        storagesPool: hash.storagesPool,
        datacenters: hash.datacenters,
        networks: hash.networks,
      });
    }).catch((err) => {
      return;
    });
  },

  cbFind(type, url) {
    return (results, cb) => {
      if (typeof results === 'function') {
        cb = results;
        results = null;
      }
      return this.get('store').find(type, null,this.opts(url)).then(function(res) {
        cb(null, res);
      }).catch(function(err) {
        cb(null, err);
      });
    };
  },

});
