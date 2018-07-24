import Ember from 'ember';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Route.extend(DefaultHeaders, {
  access: Ember.inject.service(),


  beforeModel: function() {
    this.get('access').activate().then((config) => {
      if (config) {
        this.transitionTo('authenticated');
      }
    }).catch((err) => {
      return Ember.RSVP.reject(err);
    });
  },

  model() {
    return Ember.RSVP.hash({
      wizard: this.get('store').find('wizard', null, this.opts('wizards')),
    });
  },

  getLicense: function() {
    return Ember.RSVP.hash({
      license: this.get('store').findAll('license', this.opts('licenses', true)),
    });
  },

  actions: {
    reloadModel: function() {
      var self = this;
      this.model().then(function(model) {
        self.getLicense().then(function(licence) {
          model.license = licence;
          self.controller.set('model', model);
        });
      });
    }
  }

});
