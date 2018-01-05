import Ember from 'ember';
import PolledModel from 'nilavu/mixins/polled-model';
import DefaultHeaders from 'nilavu/mixins/default-headers';

export default Ember.Route.extend(PolledModel, DefaultHeaders, {
  activate: function() {
    this.send('unfixedTop');
    this.send('unfixedBottom');
  },
  deactivate: function() {
    this.send('unfixedTop');
    this.send('unfixedBottom');
  },

  model: function() {
    const store = this.get('store');
    return store.find('assemblylist', /*this.opts('mockapiassembly'), */ null,this.opts('assemblys')).then((assemblys) => {
      return assemblys;
    }).catch(function() {
      self.set('loading', false);
    });
  },

});
