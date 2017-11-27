import Ember from 'ember';
import BrowserStore from 'nilavu/utils/browser-storage';

export default Ember.Service.extend(BrowserStore, {
  backing: window.sessionStorage,
});
