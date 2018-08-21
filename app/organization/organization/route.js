import Route from '@ember/routing/route';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import { hash } from 'rsvp';

export default Route.extend(DefaultHeaders, {
  currentOrigin: null,
  model(params) {
    this.set('currentOrigin', params.org);

    return hash({
      origin: this.get('store').find('origin', null, this.opts(`origins/${ params.org }`)),
      teams:  this.get('store').find('team', null, this.opts(`teams/origins/${ params.org }`, true)),
    });
  },

  setupController(controller) {
    controller.set('currentOrigin', this.get('currentOrigin'));
    this._super(...arguments);
  },


  actions: {
    // This will reload after edit processed by component
    reloadInner() {

      var self = this;

      self.controller.set('showInnerSpinner', true);
      self.model({ org: self.get('currentOrigin') }).then((res) => {
        self.controller.set('model', res);
        self.controller.set('showInnerSpinner', false);
      });
    }
  }
});
