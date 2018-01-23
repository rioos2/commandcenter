import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import {
  xhrConcur
} from 'nilavu/utils/platform';

export default Ember.Route.extend(DefaultHeaders, {

  activate: function() {
    this.send('unfixedTop');
    this.send('unfixedBottom');
  },
  deactivate: function() {
    this.send('unfixedTop');
    this.send('unfixedBottom');
  },
  access: Ember.inject.service(),
  session: Ember.inject.service(),


  model() {
    let promise = new Ember.RSVP.Promise((resolve, reject) => {
      let tasks = {
        profile: this.cbFind('account','accounts/' + this.get('session').get("id")),
        logData: this.cbFind('audit','accounts/' + this.get('session').get("id")+ '/audits'),
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
        profile: hash.profile,
        logData: hash.logData,
      });
    }).catch((err) => {
    });
  },

  logData: function(){
    return {
            state: 'platinum',
            alert: {
                type: 'warning',
                message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
            },
        }
  },

  afterModel(model) {
    return $.extend(model, this.logData());
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
        cb(err, null);
      });
    };
  },

});
