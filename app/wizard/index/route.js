import DefaultHeaders from 'nilavu/mixins/default-headers';
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { reject } from 'rsvp';
import { hash } from 'rsvp';

export default Route.extend(DefaultHeaders, {
  access: inject.service(),


  beforeModel() {
    this.get('access').activate().then((config) => {
      if (config) {
        this.transitionTo('authenticated');
      }
    }).catch((err) => {
      return reject(err);
    });
  },

  model() {
    return hash({ wizard: this.get('store').find('wizard', null, this.opts('wizards')) });
  },

  getLicense: function() {
    return Ember.RSVP.hash({
      license: this.get('store').findAll('license', this.opts('licenses/senseis', true)),
    });
  },

  actions: {
    reloadModel() {
      var self = this;
      this.model().then(function(model) {
        self.getLicense().then(function(license) {
          console.log(JSON.stringify(license))
          model.license = license;
          self.controller.set('model', model);
        });
      });
    }
  },

  getLicense() {
    return Ember.RSVP.hash({ license: this.get('store').findAll('license', this.opts('licenses', true)), });
  },

});
