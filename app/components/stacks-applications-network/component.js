import Ember from 'ember';
import C from 'nilavu/utils/constants';

export default Ember.Component.extend({
      tagName: 'section',
      className: '',
      group: Ember.computed.alias('category'),
      blockchainNetworks: Ember.computed.alias('fullmodel.stacksfactory.content'),
      assemblys: Ember.computed.alias('fullmodel.stacks.content'),
      parentRoute: 'stacks',
      stacksDataContents: [],

      didInsertElement: function() {
        if (!Ember.isEmpty(this.get('blockchainNetworks'))) {
          this.send('SideData', this.get('blockchainNetworks').get('firstObject'));
        }
      },

      blockchainNetworkAvailable: function() {
        alert(JSON.stringify(this.get('stacksDataContents')));
        alert(this.get('blockchainNetworks'));
        if (Ember.isEmpty(this.get('blockchainNetworks'))) {
          return [].length;
        }
        return this.get('blockchainNetworks').length;
      }.property('blockchainNetworks'),

      filterSelectedAssemblys: function() {
        this.set('stacksDataContents', []);
        this.get('selectedBlockchainNetwork.spec.assemblyfactorys').map(function(assemblyfactory) {
          self.get('assemblys').map(function(assembly) {
            assembly.object_meta.owner_reference.map(function(owner) {
              if (Ember.isEqual(assemblyfactory.id, owner.uid)) {
                this.get('stacksDataContents').push(assembly);
              }
            });
          });
        });
      }.observes('selectedBlockchainNetwork'),

      // stacksData: function() {
      //   const grp = this.get('group');
      //   return this.get('model').filter((sd) => !Ember.isNone(sd) && sd.type === grp);
      // }.property('model', 'group'),
      //
      // stacksDataContents: function() {
      //   const data = this.get('stacksData');
      //   return Ember.isEmpty(data) ? [] : data.findBy('type', this.get('group')).get('contents');
      // }.property('stacksData'),

      stacksCount: function() {
        if (Ember.isEmpty(this.get('stacksDataContents'))) {
          return [].length;
        }
        return this.get('stacksDataContents').length;
      }.property('stacksDataContents'),

      searchParmsHash: function(searchSelected) {
        let states = Ember.Object.create();
        states.set(C.FILTERS.QUERY_PARAM_SEARCH, searchSelected);
        return states;
      },


      actions: {

        search() {
          ////
          let parmsHash = this.searchParmsHash(this.get('searchFilter'));
          this.get('router').transitionTo(this.parentRoute, {
            queryParams: parmsHash
          });
          ////
        },

        SideData: function(network) {
          this.set('selectedBlockchainNetwork', network);
          this.set('selectedBlockchainNetworkTab', network.id);
        }
      },

      });
