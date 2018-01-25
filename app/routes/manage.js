import Ember from 'ember';
import PolledModel from 'nilavu/mixins/polled-model';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Route.extend(PolledModel, DefaultHeaders, {
  session: Ember.inject.service(),


  activate: function() {
    this.send('unfixedTop');
    this.send('unfixedBottom');
  },
  deactivate: function() {
    this.send('unfixedTop');
    this.send('unfixedBottom');
  },

  model: function() {
    var self = this;
    const store = this.get('store');
    return store.find('assemblylist', /*this.opts('mockapiassembly'), */ null,this.opts('accounts/' + this.get('session').get("id") +'/assemblys')).then((assemblys) => {
      return assemblys;
    }).catch(function(err) {
      self.set('loading', false);
    });
    return {};
  },

});
