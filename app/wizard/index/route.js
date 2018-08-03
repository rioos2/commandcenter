import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Route.extend(DefaultHeaders, {
  access: Ember.inject.service(),


  beforeModel() {
    this.get('access').activate().then((config) => {
      if (config) {
        this.transitionTo('authenticated');
      }
    }).catch((err) => {
      return Ember.RSVP.reject(err);
    });
  },

  model() {
    return Ember.RSVP.hash({ wizard: this.get('store').find('wizard', null, this.opts('wizards')), });
  },

  actions: {
    reloadModel() {
      var self = this;

      this.model().then((model) => {
        self.getLicense().then((licence) => {
          model.license = licence;
          self.controller.set('model', model);
        });
      });
    }
  },

  getLicense() {
    return Ember.RSVP.hash({ license: this.get('store').findAll('license', this.opts('licenses', true)), });
  },

});
