import BrowserStore from 'nilavu/utils/browser-storage';
import Ember from 'ember';

// When we open multiple tab window the tab session used as bowser store.
export default Ember.Service.extend(BrowserStore, { backing: window.sessionStorage, });
