import Ember from "ember";
const  {get} = Ember;
import C from 'nilavu/utils/constants';
export default Ember.Controller.extend({
  selectedTab: 'dashboard',
  panels: [],
  // modelSpinner: false,

});
