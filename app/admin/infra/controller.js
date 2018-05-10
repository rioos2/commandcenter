import Ember from "ember";
const  {get} = Ember;
import C from 'nilavu/utils/constants';
export default Ember.Controller.extend({
  selectedTab: 'node',
  panels: [],

    _initPanels: function() {
        this.set('panels', []);
        this.set('selectedTab', 'node');
    }.on('init'),

});
