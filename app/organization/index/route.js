import Route from '@ember/routing/route';
import DefaultHeaders from 'nilavu/mixins/default-headers';
import { hash } from 'rsvp';

export default Route.extend(DefaultHeaders, {
  currentOrigin: null,
  model() {
    return hash({ origins: this.get('store').find('origin', null, this.opts(`origins/accounts/${ this.get('session').get('id') }`)) });
  },

  actions: {
    // This will reload after edit processed by component
    reloadInner() {

      var self = this;

      self.controller.set('showInnerSpinner', true);
      self.model().then((res) => {
        self.controller.set('model', res);
        self.controller.set('showInnerSpinner', false);
      });
    }
  }

});
